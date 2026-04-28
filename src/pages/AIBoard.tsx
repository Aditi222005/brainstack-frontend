import { AIVisualBoard } from "../components/board/AIVisualBoard";

const AIBoard = () => {
    return (
        <div className="fixed inset-0 left-64 overflow-hidden z-10">
            <AIVisualBoard />
        </div>
    );
};

export default AIBoard;
