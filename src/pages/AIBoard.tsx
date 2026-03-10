import { AIVisualBoard } from "../components/board/AIVisualBoard";

const AIBoard = () => {
    return (
        <div className="absolute inset-0 left-64 overflow-hidden">
            <AIVisualBoard />
        </div>
    );
};

export default AIBoard;
