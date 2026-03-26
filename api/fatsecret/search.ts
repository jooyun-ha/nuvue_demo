const FATSECRET_TOKEN_URL = 'https://oauth.fatsecret.com/connect/token';
const FATSECRET_SEARCH_URL = 'https://platform.fatsecret.com/rest/foods/search/v4';
const FATSECRET_FOOD_URL = 'https://platform.fatsecret.com/rest/food/v4';

type FatSecretFoodSearchItem = {
  food_id?: string | number;
  food_name?: string;
  food_type?: string;
  brand_name?: string;
};

type FatSecretServing = {
  serving_id?: string | number;
  serving_description?: string;
  metric_serving_amount?: string | number;
  metric_serving_unit?: string;
  calories?: string | number;
  carbohydrate?: string | number;
  protein?: string | number;
  fat?: string | number;
  potassium?: string | number;
  sodium?: string | number;
  vitamin_b?: string | number;
  vitamin_b6?: string | number;
  vitamin_b12?: string | number;
  thiamin?: string | number;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientId = process.env.FATSECRET_CLIENT_ID;
  const clientSecret = process.env.FATSECRET_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error: 'FatSecret credentials are missing',
    });
  }

  const query = getQueryValue(req);
  if (!query) {
    return res.status(400).json({
      error: 'Missing required "query" value',
    });
  }

  try {
    const accessToken = await getFatSecretAccessToken(clientId, clientSecret);
    const searchPayload = await searchFoods(query, accessToken);
    const searchItems = normalizeSearchItems(searchPayload);

    if (searchItems.length === 0) {
      return res.status(404).json({
        query,
        error: 'No matching foods found',
      });
    }

    const bestMatch = searchItems[0];
    const foodId = String(bestMatch.food_id ?? '');

    if (!foodId) {
      return res.status(502).json({
        query,
        error: 'FatSecret did not return a usable food_id',
      });
    }

    const foodPayload = await getFoodById(foodId, accessToken);
    const normalized = normalizeFoodResponse({
      query,
      searchItem: bestMatch,
      foodPayload,
    });

    return res.status(200).json(normalized);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown FatSecret error';
    return res.status(500).json({
      error: message,
    });
  }
}

async function getFatSecretAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'basic',
  });

  const response = await fetch(FATSECRET_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`FatSecret token request failed with ${response.status}`);
  }

  const payload = (await response.json()) as { access_token?: string };
  if (!payload.access_token) {
    throw new Error('FatSecret token response did not include an access_token');
  }

  return payload.access_token;
}

async function searchFoods(query: string, accessToken: string) {
  const url = new URL(FATSECRET_SEARCH_URL);
  url.searchParams.set('search_expression', query);
  url.searchParams.set('format', 'json');
  url.searchParams.set('page_number', '0');
  url.searchParams.set('max_results', '10');

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`FatSecret foods.search failed with ${response.status}`);
  }

  return response.json();
}

async function getFoodById(foodId: string, accessToken: string) {
  const url = new URL(FATSECRET_FOOD_URL);
  url.searchParams.set('food_id', foodId);
  url.searchParams.set('format', 'json');

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`FatSecret food.get failed with ${response.status}`);
  }

  return response.json();
}

function getQueryValue(req: any): string {
  if (req.method === 'GET') {
    const value = req.query?.query;
    return typeof value === 'string' ? value.trim() : '';
  }

  const value = req.body?.query;
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeSearchItems(payload: any): FatSecretFoodSearchItem[] {
  const food = payload?.foods_search?.results?.food ?? payload?.foods_search?.food ?? [];

  if (Array.isArray(food)) {
    return food;
  }

  if (food) {
    return [food];
  }

  return [];
}

function normalizeFoodResponse(params: {
  query: string;
  searchItem: FatSecretFoodSearchItem;
  foodPayload: any;
}) {
  const food = params.foodPayload?.food ?? params.foodPayload;
  const servings = normalizeServings(food?.servings?.serving ?? food?.servings ?? []);
  const bestServing = chooseBestServing(servings);

  return {
    query: params.query,
    matchedName: buildMatchedName(params.searchItem),
    foodId: String(params.searchItem.food_id ?? ''),
    foodType: params.searchItem.food_type ?? null,
    serving: bestServing
      ? {
          description: bestServing.serving_description ?? null,
          metricAmount: toNumber(bestServing.metric_serving_amount),
          metricUnit: bestServing.metric_serving_unit ?? null,
        }
      : null,
    nutrients: {
      kcalPer100g: toNumber(bestServing?.calories),
      carbsPer100g: toNumber(bestServing?.carbohydrate),
      proteinPer100g: toNumber(bestServing?.protein),
      fatPer100g: toNumber(bestServing?.fat),
      potassiumMgPer100g: toNumber(bestServing?.potassium),
      sodiumMgPer100g: toNumber(bestServing?.sodium),
      vitaminBMgPer100g: firstDefinedNumber(
        bestServing?.vitamin_b,
        bestServing?.vitamin_b6,
        bestServing?.vitamin_b12,
        bestServing?.thiamin
      ),
    },
    rawFoodName: food?.food_name ?? params.searchItem.food_name ?? null,
  };
}

function normalizeServings(input: any): FatSecretServing[] {
  if (Array.isArray(input)) {
    return input;
  }

  if (input) {
    return [input];
  }

  return [];
}

function chooseBestServing(servings: FatSecretServing[]): FatSecretServing | null {
  if (servings.length === 0) {
    return null;
  }

  const exactHundredGram = servings.find((serving) => {
    const amount = toNumber(serving.metric_serving_amount);
    return serving.metric_serving_unit === 'g' && amount === 100;
  });

  if (exactHundredGram) {
    return exactHundredGram;
  }

  const gramServing = servings.find((serving) => serving.metric_serving_unit === 'g');
  if (gramServing) {
    return gramServing;
  }

  return servings[0] ?? null;
}

function buildMatchedName(item: FatSecretFoodSearchItem): string | null {
  const foodName = item.food_name?.trim();
  const brandName = item.brand_name?.trim();

  if (brandName && foodName) {
    return `${brandName} ${foodName}`;
  }

  return foodName ?? brandName ?? null;
}

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function firstDefinedNumber(...values: unknown[]): number | undefined {
  for (const value of values) {
    const parsed = toNumber(value);
    if (parsed !== undefined) {
      return parsed;
    }
  }

  return undefined;
}
