// SellQo Storefront Proxy — translates REST to POST actions
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, accept-language, x-tenant-id, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
};

const SELLQO_API_URL = "https://gczmfcabnoofnmfpzeop.supabase.co/functions/v1/storefront-api";

/**
 * Translate REST path + method into a SellQo storefront-api POST body
 */
function resolveAction(
  method: string,
  path: string,
  query: URLSearchParams,
  body: Record<string, unknown> | null,
  tenantId: string,
): { action: string; tenant_id: string; params: Record<string, unknown> } {
  const segments = path.replace(/^\//, '').split('/').filter(Boolean);
  const params: Record<string, unknown> = {};

  // --- PRODUCTS ---
  if (segments[0] === 'products') {
    if (segments.length === 1) {
      for (const [k, v] of query.entries()) params[k] = v;
      if (query.get('search') || query.get('q')) {
        params.query = query.get('search') || query.get('q');
        return { action: 'search_products', tenant_id: tenantId, params };
      }
      return { action: 'get_products', tenant_id: tenantId, params };
    }
    if (segments[1] === 'search') {
      params.query = query.get('q') || '';
      if (query.get('limit')) params.limit = Number(query.get('limit'));
      return { action: 'search_products', tenant_id: tenantId, params };
    }
    if (segments.length === 2) {
      params.slug = segments[1];
      return { action: 'get_product', tenant_id: tenantId, params };
    }
    if (segments.length === 3 && segments[2] === 'related') {
      params.slug = segments[1];
      if (query.get('limit')) params.limit = Number(query.get('limit'));
      return { action: 'get_product', tenant_id: tenantId, params };
    }
  }

  // --- COLLECTIONS ---
  if (segments[0] === 'collections') {
    if (segments.length === 1) {
      return { action: 'get_categories', tenant_id: tenantId, params };
    }
    if (segments.length >= 2 && segments[2] === 'products') {
      params.category_slug = segments[1];
      for (const [k, v] of query.entries()) params[k] = v;
      return { action: 'get_products', tenant_id: tenantId, params };
    }
    if (segments.length === 2) {
      params.slug = segments[1];
      return { action: 'get_categories', tenant_id: tenantId, params };
    }
  }

  // --- CATEGORIES ---
  if (segments[0] === 'categories') {
    return { action: 'get_categories', tenant_id: tenantId, params };
  }

  // --- CART ---
  if (segments[0] === 'cart') {
    if (segments.length === 1 && method === 'POST') {
      return { action: 'cart_create', tenant_id: tenantId, params: { ...params, ...body } };
    }
    const cartId = segments[1];
    if (cartId) params.cart_id = cartId;

    if (segments.length === 2 && method === 'GET') {
      return { action: 'cart_get', tenant_id: tenantId, params };
    }
    if (segments.length === 2 && method === 'DELETE') {
      return { action: 'cart_clear', tenant_id: tenantId, params };
    }

    if (segments[2] === 'items') {
      if (segments.length === 3 && method === 'POST') {
        return { action: 'cart_add_item', tenant_id: tenantId, params: { ...params, ...body } };
      }
      if (segments.length === 4) {
        params.item_id = segments[3];
        if (method === 'PUT' || method === 'PATCH') {
          return { action: 'cart_update_item', tenant_id: tenantId, params: { ...params, ...body } };
        }
        if (method === 'DELETE') {
          return { action: 'cart_remove_item', tenant_id: tenantId, params };
        }
      }
    }

    if (segments[2] === 'discount') {
      if (method === 'POST') {
        return { action: 'cart_apply_discount', tenant_id: tenantId, params: { ...params, ...body } };
      }
      if (method === 'DELETE') {
        return { action: 'cart_remove_discount', tenant_id: tenantId, params };
      }
    }
  }

  // --- CHECKOUT ---
  if (segments[0] === 'checkout' && method === 'POST') {
    return { action: 'checkout_start', tenant_id: tenantId, params: { ...params, ...body } };
  }

  // --- NEWSLETTER ---
  if (segments[0] === 'newsletter' && method === 'POST') {
    return { action: 'newsletter_subscribe', tenant_id: tenantId, params: { ...params, ...body } };
  }

  // --- CONTACT ---
  if (segments[0] === 'contact' && method === 'POST') {
    return { action: 'submit_contact', tenant_id: tenantId, params: { ...params, ...body } };
  }

  // Fallback
  return { action: segments.join('_'), tenant_id: tenantId, params: { ...params, ...body } };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SELLQO_API_KEY = Deno.env.get("SELLQO_API_KEY");
  if (!SELLQO_API_KEY) {
    return new Response(
      JSON.stringify({ error: "SELLQO_API_KEY not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^.*\/sellqo-proxy/, '') || '/';
    const tenantId = req.headers.get("x-tenant-id") || "2606c5b9-caf8-4a42-94cd-80e3f3f31988";

    // Parse body for non-GET methods
    let body: Record<string, unknown> | null = null;
    if (req.method !== "GET" && req.method !== "HEAD") {
      const raw = await req.text();
      if (raw) {
        try { body = JSON.parse(raw); } catch { body = null; }
      }
    }

    const storefrontBody = resolveAction(req.method, path, url.searchParams, body, tenantId);
    console.log(`[sellqo-proxy] ${req.method} ${path} → action: ${storefrontBody.action}`);

    const response = await fetch(SELLQO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": SELLQO_API_KEY,
      },
      body: JSON.stringify(storefrontBody),
    });

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("SellQo proxy error:", error);
    return new Response(
      JSON.stringify({ error: "Proxy request failed", details: String(error) }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
