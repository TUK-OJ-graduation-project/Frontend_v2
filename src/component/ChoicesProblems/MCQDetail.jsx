import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import tino from "./tino2.png";

const MCQDetail = () => {
    const [mcq, setMcq] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchMCQ = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v2/mcq/${id}/`);
                console.log("Fetched data:", response.data);
                setMcq(response.data[0]);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchMCQ();
    }, [id]);

    const handleSubmit = () => {
        if (selectedOption) {
            const correctOption = mcq.options.find(opt => opt.is_correct);
            setIsCorrect(selectedOption.id === correctOption.id);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading question. Please try again.</p>;
    }

    if (!mcq || !mcq.options) {
        return <p>Unexpected data format. Check the console for details.</p>;
    }

    return (

        <div className="mcq-detail-container">
            <div className="tino-image">
        <img src={tino} alt="Tino" className="quiz-tino" />
      </div>
            <h2>{mcq.question_text}</h2>
            <div className='mcq-details'>
            {mcq.options.map(option => (
                <div key={option.id}>
                    <label>
                        <input
                            type="radio"
                            value={option.id}
                            checked={selectedOption?.id === option.id}
                            onChange={() => setSelectedOption(option)}
                        />
                        {option.option_text}
                    </label>
                </div>
            ))}
            </div>

            <button onClick={handleSubmit}>Submit</button>
            {isCorrect !== null && (
                <p>{isCorrect ? 'Correct!' : 'Incorrect. Try again.'}</p>
            )}
            <div className='next-btn'>
                <Link to="/mcqlist">Back to List</Link>
            </div>
        </div>
    );
};

export default MCQDetail;