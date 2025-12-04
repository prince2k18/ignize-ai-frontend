'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileImage, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  PenTool,
  Target,
  BookOpen
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type EvaluationResult = {
  success: boolean;
  extracted_text: string;
  ocr_confidence: number;
  ocr_engine: string;
  evaluation?: {
    total_score: number;
    max_score: number;
    percentage: number;
    grade: string;
    scores: Record<string, number>;
    feedback: Record<string, string>;
    missing_points: string[];
    strengths: string[];
    improved_intro: string;
    improved_conclusion: string;
  };
  error?: string;
};

export default function HandwritingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [marks, setMarks] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!file || !question.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('question', question);
      formData.append('marks', marks.toString());

      const response = await fetch(`${API_URL}/api/v1/evaluate-handwritten`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        extracted_text: '',
        ocr_confidence: 0,
        ocr_engine: '',
        error: 'Failed to connect to server',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-400';
    if (grade.startsWith('B')) return 'text-blue-400';
    if (grade.startsWith('C')) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Handwriting Evaluation</h1>
              <p className="text-gray-400">Upload your handwritten answer for AI evaluation</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-saffron-500" />
              Upload Answer Sheet
            </h2>

            {/* File Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                preview 
                  ? 'border-saffron-500 bg-saffron-500/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {preview ? (
                <div>
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="max-h-64 mx-auto rounded-lg mb-4"
                  />
                  <p className="text-sm text-gray-400">{file?.name}</p>
                  <p className="text-xs text-saffron-500 mt-2">Click to change</p>
                </div>
              ) : (
                <div>
                  <FileImage className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-400 mb-2">Drop your handwritten answer here</p>
                  <p className="text-sm text-gray-500">Supports: JPG, PNG, PDF</p>
                </div>
              )}
            </div>

            {/* Question Input */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter the UPSC question you answered..."
                className="w-full p-4 rounded-xl bg-navy-800 border border-white/10 focus:border-saffron-500 outline-none text-white placeholder-gray-500 resize-none"
                rows={3}
              />
            </div>

            {/* Marks */}
            <div className="mt-4 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300">Marks:</label>
              <select
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                className="px-4 py-2 rounded-lg bg-navy-800 border border-white/10 text-white"
              >
                <option value={10}>10 marks</option>
                <option value={15}>15 marks</option>
                <option value={20}>20 marks</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!file || !question.trim() || isLoading}
              className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-600 hover:to-saffron-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Evaluate Answer
                </>
              )}
            </button>
          </motion.div>

          {/* Results Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-saffron-500" />
              Evaluation Result
            </h2>

            {!result && !isLoading && (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Upload and submit to see results</p>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-saffron-500" />
                  <p className="text-gray-400">Extracting text & evaluating...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take 10-30 seconds</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* OCR Result */}
                <div className="p-4 rounded-xl bg-navy-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">OCR Confidence</span>
                    <span className="text-saffron-500 font-medium">
                      {(result.ocr_confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Engine: {result.ocr_engine}
                  </div>
                </div>

                {/* Extracted Text */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Extracted Text</h3>
                  <div className="p-4 rounded-xl bg-navy-800/50 max-h-40 overflow-y-auto text-sm text-gray-300">
                    {result.extracted_text || 'No text extracted'}
                  </div>
                </div>

                {result.evaluation && (
                  <>
                    {/* Score */}
                    <div className="p-6 rounded-xl bg-gradient-to-r from-navy-800 to-navy-700 text-center">
                      <div className="text-5xl font-bold mb-2">
                        <span className={getGradeColor(result.evaluation.grade)}>
                          {result.evaluation.grade}
                        </span>
                      </div>
                      <div className="text-2xl font-semibold text-white">
                        {result.evaluation.total_score}/{result.evaluation.max_score}
                      </div>
                      <div className="text-gray-400">
                        ({result.evaluation.percentage.toFixed(1)}%)
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-3">Score Breakdown</h3>
                      <div className="space-y-2">
                        {Object.entries(result.evaluation.scores).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm text-gray-400 capitalize">
                              {key.replace(/_/g, ' ')}
                            </span>
                            <span className="text-white font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Missing Points */}
                    {result.evaluation.missing_points?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-red-400 mb-2">Missing Points</h3>
                        <ul className="space-y-1">
                          {result.evaluation.missing_points.map((point, i) => (
                            <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Strengths */}
                    {result.evaluation.strengths?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-green-400 mb-2">Strengths</h3>
                        <ul className="space-y-1">
                          {result.evaluation.strengths.map((strength, i) => (
                            <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Improved Intro */}
                    {result.evaluation.improved_intro && (
                      <div>
                        <h3 className="text-sm font-medium text-blue-400 mb-2">Suggested Introduction</h3>
                        <p className="text-sm text-gray-300 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          {result.evaluation.improved_intro}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {result.error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    {result.error}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

