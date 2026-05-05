import { useEffect, useState } from "react";

function StoryGame({ story, onNewStory }) {
    const [currentNode, setCurrentNode] = useState(null);
    const [currentNodeId, setCurrentNodeId] = useState(null);
    const [options, setOptions] = useState([]);  // FIX: was 'Opions'
    const [isEnding, setIsEnding] = useState(false);
    const [isWinningEnding, setIsWinningEnding] = useState(false);

    useEffect(() => {
        if (story && story.root_node) {
            setCurrentNodeId(story.root_node.id);
        }
    }, [story]);

    useEffect(() => {
        if (currentNodeId && story && story.all_nodes) {
            const node = story.all_nodes[currentNodeId];  // FIX: node was never defined
            if (!node) return;
            setCurrentNode(node);
            setIsEnding(node.is_ending);
            setIsWinningEnding(node.is_winning_ending);

            if (!node.is_ending && node.options && node.options.length > 0) {
                setOptions(node.options);
            } else {
                setOptions([]);
            }
        }
    }, [currentNodeId, story]);

    const chooseOption = (optionId) => {
        setCurrentNodeId(optionId);  // FIX: was incorrectly setting root_node.id
    };  // FIX: closing brace was misplaced before return

    return (
        <div className="story-game">
            <header className="story-header">
                <h2>{story?.title}</h2>
            </header>

            <div className="story-content">
                {currentNode && (
                    <div className="story-node">
                        <p>{currentNode.content}</p>

                        {isEnding ? (
                            <div className="story-ending">
                                <h3>{isWinningEnding ? "Congratulations!" : "Game Over"}</h3>
                                {isWinningEnding
                                    ? <p>You have successfully completed the adventure.</p>
                                    : <p>Better luck next time!</p>}
                            </div>
                        ) : (
                            <div className="story-options">
                                <h3>What will you do?</h3>
                                <div className="options-list">
                                    {options.map((option, index) => (  // FIX: was 'Options'
                                        <button
                                            key={index}
                                            onClick={() => chooseOption(option.node_id)}
                                            className="option-btn">
                                            {option.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="story-controls">  
                <button onClick={onNewStory} className="reset-btn">
                    Restart Story
                </button>
                {onNewStory && (  // FIX: broken JSX syntax
                    <button onClick={onNewStory} className="new-story-btn">
                        New Story
                    </button>
                )}
            </div>
        </div>
    );
}

export default StoryGame;