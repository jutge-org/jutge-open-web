import { memo } from 'radash'

// prices in USD per 1M tokens
const prices = {
    'openai/gpt-5.4': {
        input: 2.5,
        output: 15.0,
    },
    'openai/gpt-5.4-mini': {
        input: 0.75,
        output: 4.5,
    },
    'openai/gpt-5.4-nano': {
        input: 0.2,
        output: 1.25,
    },

    'openai/gpt-4.1': {
        input: 2.0,
        output: 8.0,
    },
    'openai/gpt-4.1-mini': {
        input: 0.4,
        output: 1.6,
    },
    'openai/gpt-4.1-nano': {
        input: 0.1,
        output: 0.4,
    },

    'openai/gpt-5': {
        input: 1.25,
        output: 10.0,
    },
    'openai/gpt-5-mini': {
        input: 0.25,
        output: 2.0,
    },
    'openai/gpt-5-nano': {
        input: 0.05,
        output: 0.4,
    },

    'google/gemini-2.5-pro': {
        input: 1.25,
        output: 10.0,
    },
    'google/gemini-2.5-flash': {
        input: 0.3,
        output: 2.5,
    },
    'google/gemini-2.5-flash-lite': {
        input: 0.1,
        output: 0.4,
    },
}

function calculateCost(inputTokens: number, outputTokens: number, model: string) {
    if (!Object.keys(prices).includes(model)) {
        throw new Error(`Model not supported: ${model}`)
    }
    const price = prices[model as keyof typeof prices]
    const inputCost = (inputTokens * price.input) / 1_000_000
    const outputCost = (outputTokens * price.output) / 1_000_000
    return inputCost + outputCost
}

async function dolarsToEurosSlow(amount: number) {
    try {
        const request = await fetch('https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD')
        const data: { rates: { USD: number } } = await request.json()
        const rate = data.rates.USD
        return amount / rate
    } catch {
        return amount / 0.85
    }
}

export const dolarsToEuros = memo(dolarsToEurosSlow)

function eurosWithTax(amount: number) {
    return amount * 1.21
}

export type LlmEstimation = {
    inputTokens: number
    outputTokens: number
    model: string
    priceEurTax: number
    wattHours: number
    joules: number
    co2Grams: number
    carKm: number
    trees: number
    waterLiters: number
    brainHours: number
}

export async function llmEstimates(
    inputTokens: number,
    outputTokens: number,
    model: string,
): Promise<LlmEstimation> {
    const priceEurTax = eurosWithTax(await dolarsToEuros(calculateCost(inputTokens, outputTokens, model)))

    const wattsPerToken = 0.000833
    const co2PerTreePerYear = 22000
    const totalTokens = inputTokens + outputTokens

    const wattHours = totalTokens * wattsPerToken
    const joules = wattHours * 3600

    const co2PerKwh = 445
    const co2Grams = (wattHours * co2PerKwh) / 1000

    const trees = co2Grams / co2PerTreePerYear
    const carKm = co2Grams / 170

    const directWaterPerKwh = 1.8
    const indirectWaterPerKwh = 4.5
    const totalWaterPerKwh = directWaterPerKwh + indirectWaterPerKwh
    const waterLiters = (wattHours * totalWaterPerKwh) / 1000

    const brainWatts = 20
    const brainSeconds = (wattHours * 3600) / brainWatts
    const brainHours = brainSeconds / 3600

    return {
        inputTokens,
        outputTokens,
        model,
        priceEurTax,
        wattHours,
        joules,
        co2Grams,
        carKm,
        trees,
        waterLiters,
        brainHours,
    }
}
