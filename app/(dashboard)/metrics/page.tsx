'use client'

import { useState } from 'react'
import {
    BarChart3,
    TrendingUp,
    Target,
    AlertCircle,
    CheckCircle,
    XCircle,
    Loader2,
    Play,
    RefreshCw,
} from 'lucide-react'

type MetricsResult = {
    totalQuestions: number
    correctAnswers: number
    accuracy: number
    llmCalls: number
    totalTokens: number
    timeSeconds: number
    incorrectQuestions: Array<{
        id: number
        selected: string
        correct: string
    }>
}

export default function MetricsPage() {
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<MetricsResult | null>(null)
    const [testConfig, setTestConfig] = useState({
        limit: 20,
        batchSize: 5,
    })

    const runEvaluation = async () => {
        setLoading(true)
        try {
            // Call the UPSC solver API
            const response = await fetch('/api/metrics/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testConfig),
            })
            const data = await response.json()
            setResults(data)
        } catch (error) {
            console.error('Evaluation failed:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-3 shadow-lg">
                        <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Metrics AI</h1>
                        <p className="text-gray-600">UPSC Solver Performance Analytics</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-8">
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-emerald-100 p-3">
                            <Target className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Accuracy</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {results ? `${results.accuracy.toFixed(1)}%` : '--'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-3">
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Correct</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {results ? `${results.correctAnswers}/${results.totalQuestions}` : '--'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-orange-100 p-3">
                            <TrendingUp className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">LLM Calls</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {results ? results.llmCalls.toLocaleString() : '--'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-purple-100 p-3">
                            <AlertCircle className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tokens Used</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {results ? `${(results.totalTokens / 1000).toFixed(0)}K` : '--'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Control Panel */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Run Evaluation</h2>

                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Questions
                        </label>
                        <select
                            value={testConfig.limit}
                            onChange={(e) => setTestConfig({ ...testConfig, limit: Number(e.target.value) })}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none"
                        >
                            <option value={10}>10 questions</option>
                            <option value={20}>20 questions</option>
                            <option value={50}>50 questions</option>
                            <option value={100}>100 questions</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Batch Size
                        </label>
                        <select
                            value={testConfig.batchSize}
                            onChange={(e) => setTestConfig({ ...testConfig, batchSize: Number(e.target.value) })}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none"
                        >
                            <option value={5}>5 parallel</option>
                            <option value={10}>10 parallel</option>
                            <option value={20}>20 parallel</option>
                        </select>
                    </div>

                    <button
                        onClick={runEvaluation}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Running...
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4" />
                                Run Evaluation
                            </>
                        )}
                    </button>
                </div>

                {loading && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>This may take several minutes for large evaluations...</span>
                    </div>
                )}
            </div>

            {/* Results Table */}
            {results && results.incorrectQuestions.length > 0 && (
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Incorrect Answers ({results.incorrectQuestions.length})
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Question</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Selected</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Correct</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.incorrectQuestions.map((q) => (
                                    <tr key={q.id} className="border-b border-gray-100">
                                        <td className="py-3 px-4 text-sm text-gray-900">Q{q.id}</td>
                                        <td className="py-3 px-4">
                                            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                                                {q.selected.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                                                {q.correct.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Accuracy Progress */}
            {results && (
                <div className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-semibold opacity-90">Target: 92%+</p>
                            <p className="text-3xl font-bold">{results.accuracy.toFixed(1)}% Current</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm opacity-80">Gap to target</p>
                            <p className="text-2xl font-bold">{Math.max(0, 92 - results.accuracy).toFixed(1)}%</p>
                        </div>
                    </div>

                    <div className="mt-4 h-3 rounded-full bg-white/20">
                        <div
                            className="h-full rounded-full bg-white transition-all"
                            style={{ width: `${Math.min(100, (results.accuracy / 92) * 100)}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
