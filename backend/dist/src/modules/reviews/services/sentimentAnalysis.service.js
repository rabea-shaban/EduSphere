"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentimentAnalysisService = void 0;
class SentimentAnalysisService {
    /**
     * Analyzes review text to classify sentiment as POSITIVE, NEUTRAL, or NEGATIVE
     * and extracts key feedback keywords.
     */
    static analyze(comment, rating) {
        const text = comment.toLowerCase();
        // Default sentiment based on rating
        let sentiment = rating >= 4 ? 'POSITIVE' : rating <= 2 ? 'NEGATIVE' : 'NEUTRAL';
        // Positive indicators in Arabic and English
        const positiveWords = ['ممتاز', 'رائع', 'شرح متميز', 'مفيد', 'أفضل', 'شكرا', 'واضح', 'مبسط', 'مفهوم', 'great', 'excellent', 'amazing', 'best', 'helpful', 'clear'];
        // Negative indicators
        const negativeWords = ['سيء', 'صعب', 'غير واضح', 'معقد', 'ضعيف', 'ملل', 'بطيء', 'صوت ضئيل', 'bad', 'poor', 'confusing', 'boring', 'worst', 'hard'];
        let posCount = 0;
        let negCount = 0;
        positiveWords.forEach((w) => {
            if (text.includes(w))
                posCount++;
        });
        negativeWords.forEach((w) => {
            if (text.includes(w))
                negCount++;
        });
        if (posCount > negCount && rating >= 3) {
            sentiment = 'POSITIVE';
        }
        else if (negCount > posCount && rating <= 3) {
            sentiment = 'NEGATIVE';
        }
        // Extract key phrases
        const keywords = [];
        if (text.includes('شرح'))
            keywords.push('جودة الشرح');
        if (text.includes('تمارين') || text.includes('أسئلة'))
            keywords.push('تطبيقات وأمثلة');
        if (text.includes('صوت') || text.includes('فيديو'))
            keywords.push('جودة التسجيل');
        if (text.includes('مبسط') || text.includes('سهل'))
            keywords.push('أسلوب التبسيط');
        if (text.includes('اختبار') || text.includes('واجب'))
            keywords.push('التقييمات');
        if (keywords.length === 0) {
            keywords.push(sentiment === 'POSITIVE' ? 'انطباع إيجابي عام' : 'ملاحظات تحسين');
        }
        return { sentiment, keywords };
    }
}
exports.SentimentAnalysisService = SentimentAnalysisService;
exports.default = SentimentAnalysisService;
