import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeDetail from '../components/RecipeDetail';

const RecipeView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24">
            <RecipeDetail
                recipe={{ _id: id }}
                onBack={() => navigate('/', { replace: true })}
                backLabel="Back to Discover"
            />
        </div>
    );
};

export default RecipeView;
