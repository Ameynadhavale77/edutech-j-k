import { Button } from "@/components/ui/button";

interface QuizOption {
  id: string;
  text: string;
  weights: Record<string, number>;
}

interface QuizQuestionProps {
  question: any; // Can be either a string or a translated question object
  selectedAnswer: string | null;
  onAnswerSelect: (optionId: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuizQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
  totalQuestions,
}: QuizQuestionProps) {
  // Handle both string (legacy) and object (new translated) question formats
  const questionText = typeof question === 'string' ? question : question?.question || '';
  const options = typeof question === 'object' && question?.options ? question.options : [];
  return (
    <div className="slide-in" data-testid="quiz-question">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground" data-testid="text-question-progress">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm text-muted-foreground" data-testid="text-progress-percent">
            Progress: {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            data-testid="progress-bar"
          ></div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-6" data-testid="text-question">
        {questionText}
      </h3>

      <div className="space-y-3">
        {options.map((option: any) => (
          <Button
            key={option.id}
            variant="outline"
            className={`quiz-option w-full text-left p-4 h-auto ${
              selectedAnswer === option.id ? 'selected' : ''
            }`}
            onClick={() => onAnswerSelect(option.id)}
            data-testid={`button-option-${option.id}`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-border rounded-full flex items-center justify-center">
                <div 
                  className={`w-3 h-3 bg-primary rounded-full ${
                    selectedAnswer === option.id ? 'block' : 'hidden'
                  }`}
                  data-testid={`indicator-option-${option.id}`}
                ></div>
              </div>
              <span className="text-sm">{option.text}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
