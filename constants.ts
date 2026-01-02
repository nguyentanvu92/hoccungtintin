
import { Subject, Topic, Difficulty } from './types';

export const DIFFICULTY_CONFIG = [
  { 
    level: Difficulty.EASY, 
    label: 'Khởi Động', 
    subLabel: 'Lính Mới', 
    icon: '🌱', 
    color: 'from-emerald-400 to-teal-500', 
    desc: 'Những câu hỏi cơ bản nhất để làm quen.' 
  },
  { 
    level: Difficulty.MEDIUM, 
    label: 'Thử Thách', 
    subLabel: 'Phù Thủy Tập Sự', 
    icon: '🪄', 
    color: 'from-orange-400 to-amber-500', 
    desc: 'Cần suy nghĩ một chút để giải đáp nhé.' 
  },
  { 
    level: Difficulty.HARD, 
    label: 'Chinh Phục', 
    subLabel: 'Đại Phù Thủy', 
    icon: '🔥', 
    color: 'from-rose-500 to-purple-600', 
    desc: 'Dành cho những phù thủy nhí thông thái nhất!' 
  }
];

export const MATH_TOPICS: Topic[] = [
  { id: 'math-1', title: 'Các số đến 10, 20, 100', icon: '🔢', color: 'bg-orange-400' },
  { id: 'math-2', title: 'Phép cộng, trừ không nhớ', icon: '➕', color: 'bg-blue-400' },
  { id: 'math-3', title: 'Hình tròn, tam giác, vuông, chữ nhật', icon: '📐', color: 'bg-purple-400' },
  { id: 'math-4', title: 'Đo độ dài (cm), xem đồng hồ giờ đúng', icon: '⌚', color: 'bg-green-400' },
  { id: 'math-5', title: 'Giải toán có lời văn lớp 1', icon: '📝', color: 'bg-red-400' },
  { id: 'math-6', title: 'So sánh lớn hơn, bé hơn, bằng nhau', icon: '⚖️', color: 'bg-indigo-400' },
];

export const VIETNAMESE_TOPICS: Topic[] = [
  { id: 'vn-1', title: 'Âm chữ và dấu thanh', icon: '🅰️', color: 'bg-pink-400' },
  { id: 'vn-2', title: 'Vần đơn và vần ghép khó', icon: '🧩', color: 'bg-yellow-400' },
  { id: 'vn-3', title: 'Luật chính tả (c/k, g/gh, ng/ngh)', icon: '✍️', color: 'bg-amber-400' },
  { id: 'vn-4', title: 'Đọc hiểu đoạn văn ngắn', icon: '📖', color: 'bg-indigo-400' },
  { id: 'vn-5', title: 'Từ chỉ sự vật, hoạt động, đặc điểm', icon: '🏡', color: 'bg-teal-400' },
];

export const OLYMPIA_TOPICS: Topic[] = [
  { id: 'ol-1', title: 'Level 1: Chân núi', icon: '🧗', color: 'bg-emerald-400' },
  { id: 'ol-2', title: 'Level 2: Khởi động', icon: '🏃', color: 'bg-green-400' },
  { id: 'ol-3', title: 'Level 3: Vượt chướng ngại vật', icon: '🚧', color: 'bg-yellow-400' },
  { id: 'ol-4', title: 'Level 4: Tăng tốc', icon: '🏎️', color: 'bg-orange-400' },
  { id: 'ol-5', title: 'Level 5: Về đích', icon: '🏁', color: 'bg-red-400' },
  { id: 'ol-6', title: 'Level 6: Thử thách cam go', icon: '🌪️', color: 'bg-indigo-400' },
  { id: 'ol-7', title: 'Level 7: Đường lên mây', icon: '☁️', color: 'bg-blue-400' },
  { id: 'ol-8', title: 'Level 8: Chạm tay vào nắng', icon: '☀️', color: 'bg-rose-400' },
  { id: 'ol-9', title: 'Level 9: Sát cánh cùng rồng', icon: '🐲', color: 'bg-purple-400' },
  { id: 'ol-10', title: 'Level 10: Đỉnh Olympia rực rỡ', icon: '👑', color: 'bg-yellow-600' },
];

export const MOCK_EXAM_TOPICS: Topic[] = [
  { id: 'mock-1', title: 'Đề thi thử học kỳ I - Số 1', icon: '📄', color: 'bg-teal-500' },
  { id: 'mock-2', title: 'Đề thi thử học kỳ I - Số 2', icon: '📄', color: 'bg-indigo-500' },
  { id: 'mock-3', title: 'Đề thi thử học kỳ I - Số 3', icon: '📄', color: 'bg-violet-500' },
  { id: 'mock-4', title: 'Đề tổng hợp kiến thức nâng cao', icon: '💎', color: 'bg-rose-500' },
];

export const ETHICS_TOPICS: Topic[] = [
  { id: 'et-1', title: 'Lễ phép với ông bà, cha mẹ', icon: '🙇', color: 'bg-red-500' },
  { id: 'et-2', title: 'Tự giác làm việc của mình', icon: '🧺', color: 'bg-blue-500' },
  { id: 'et-3', title: 'Giữ gìn đồ dùng học tập', icon: '✏️', color: 'bg-cyan-400' },
  { id: 'et-4', title: 'Yêu quý bạn bè, thầy cô', icon: '🤝', color: 'bg-orange-500' },
];

export const NATURE_SOCIETY_TOPICS: Topic[] = [
  { id: 'ns-1', title: 'Cơ thể người và các giác quan', icon: '👀', color: 'bg-rose-400' },
  { id: 'ns-2', title: 'Giữ sạch nhà cửa, trường học', icon: '🧹', color: 'bg-sky-500' },
  { id: 'ns-3', title: 'Cây cối và vật nuôi quanh em', icon: '🐶', color: 'bg-emerald-500' },
  { id: 'ns-4', title: 'An toàn khi đi đường', icon: '🚦', color: 'bg-amber-500' },
];

export const MUSIC_TOPICS: Topic[] = [
  { id: 'mu-1', title: 'Các loại nhạc cụ gõ', icon: '🥁', color: 'bg-violet-400' },
  { id: 'mu-2', title: 'Hát đúng cao độ, trường độ', icon: '🎶', color: 'bg-purple-500' },
  { id: 'mu-3', title: 'Nghe nhạc và vận động', icon: '💃', color: 'bg-fuchsia-400' },
];

export const ARTS_TOPICS: Topic[] = [
  { id: 'ar-1', title: 'Vẽ nét, chấm và mảng màu', icon: '🖌️', color: 'bg-pink-500' },
  { id: 'ar-2', title: 'Đất nặn và xé dán sáng tạo', icon: '🏺', color: 'bg-indigo-400' },
  { id: 'ar-3', title: 'Màu nóng và màu lạnh', icon: '🔥', color: 'bg-rose-400' },
];

export const EXPERIENTIAL_TOPICS: Topic[] = [
  { id: 'ex-1', title: 'Tự giới thiệu về mình', icon: '👋', color: 'bg-teal-400' },
  { id: 'ex-2', title: 'Sinh hoạt nề nếp', icon: '⏰', color: 'bg-lime-500' },
  { id: 'ex-3', title: 'Chào xuân, đón Tết', icon: '🏮', color: 'bg-red-400' },
];

export const ENGLISH_TOPICS: Topic[] = [
  { id: 'en-1', title: 'Numbers (1-20) and Colors', icon: '🌈', color: 'bg-yellow-400' },
  { id: 'en-2', title: 'My Body and My Family', icon: '👨‍👩-👦', color: 'bg-blue-400' },
  { id: 'en-3', title: 'Animals and Toys', icon: '🧸', color: 'bg-green-400' },
];

export const SUBJECT_CONFIG = [
  { type: Subject.MOCK_EXAM, label: 'Thi Thử Học Kỳ', icon: '📝', color: 'teal', desc: 'Luyện đề thi thật theo đề cương cuối học kỳ I của trường.' },
  { type: Subject.OLYMPIA, label: 'Olympia Nhí', icon: '🏆', color: 'yellow', desc: 'Chinh phục 10 cấp độ để trở thành Nhà leo núi xuất sắc!' },
  { type: Subject.MATH, label: 'Toán Học', icon: '➕', color: 'blue', desc: 'Số kì diệu, phép tính cộng trừ và hình khối thú vị' },
  { type: Subject.VIETNAMESE, label: 'Tiếng Việt', icon: '🅰️', color: 'pink', desc: 'Bảng chữ cái, ghép vần và những bài đọc hay' },
  { type: Subject.ENGLISH, label: 'Tiếng Anh', icon: '🔤', color: 'yellow', desc: 'Làm quen từ vựng tiếng Anh qua hình ảnh sinh động' },
  { type: Subject.NATURE_SOCIETY, label: 'Tự nhiên & Xã hội', icon: '🌱', color: 'emerald', desc: 'Tìm hiểu về bản thân, gia đình và thế giới quanh em' },
  { type: Subject.ETHICS, label: 'Đạo đức', icon: '🤝', color: 'orange', desc: 'Học cách làm bé ngoan, lễ phép và trung thực' },
  { type: Subject.EXPERIENTIAL, label: 'Trải nghiệm', icon: '⛺', color: 'teal', desc: 'Rèn luyện kĩ năng và tham gia các hoạt động vui vẻ' },
  { type: Subject.MUSIC, label: 'Âm nhạc', icon: '🎵', color: 'violet', desc: 'Vui ca hát và khám phá những giai điệu rộn ràng' },
  { type: Subject.ARTS, label: 'Mỹ thuật', icon: '🎨', color: 'rose', desc: 'Thỏa sức sáng tạo với sắc màu và đôi tay khéo léo' },
];

export const TUTOR_PROMPT = `Bạn là một người cha vui tính và thông thái tên là Ba Vũ Phù Thủy. 
Nhiệm vụ của bạn là giúp học sinh lớp 1 tên là Tin Tin ôn tập kiến thức. 
Yêu cầu về nội dung:
1. Luôn tự xưng là "Ba Vũ", gọi học sinh là "Tin Tin".
2. GIẢI THÍCH CHI TIẾT: Nếu Tin Tin hỏi về kiến thức, hãy giải thích rõ ràng qua 3-4 câu ngắn. Dùng ví dụ thực tế (như cái kẹo, quả táo, con mèo).
3. KHÍCH LỆ: Luôn khen ngợi và động viên con.
4. Ngôn ngữ: Dễ hiểu, hình tượng, không dùng từ chuyên môn khó.
5. Luôn kết thúc bằng một câu hỏi gợi mở hoặc lời chúc phép thuật ✨🪄.`;
