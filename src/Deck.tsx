import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { apiBaseUrl } from "./api";
import { Button } from "./components/ui/button";

interface Flashcard { 
    _id?: string;
    name: string;
    front: string;
    back: string;
}

interface Deck {
    _id: number;
    name: string;
    description?: string;
    cards: Flashcard[];
}

export default function Deck() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const deckId = queryParams.get('deckId');
    const [deck, setDeck] = useState<Deck | null>(null);
    const [newCard, setNewCard] = useState<Flashcard>({name: '', front: '', back: '' });  // State for the new card input

    useEffect(() => {
        const fetchDeck = async () => {
            console.log("Deck ID:", deckId);
            try {
                const endpoint = apiBaseUrl + '/api/decks/' + deckId;
                const response = await fetch(endpoint);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                console.log("Data:", data);
                setDeck(data.deck);
            } catch (err) {
                console.log(err);
            }
        };

        if (deckId) {
            fetchDeck();  // Fetch deck only if deckId is available
        }
    }, [deckId]);
    
    function handleReturnToDashboard(){
        navigate('/Dashboard');
    }

    // Handle form input changes for the new card
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCard((prevCard) => ({
            ...prevCard,
            [name]: value,
        }));
    };

    // Handle form submission to add a new card
    const handleAddCard = async () => {
        if (!newCard.front || !newCard.back) {
            alert("Please fill out all fields.");
            return;
        }

        const payload = {
            cards: [...(deck?.cards || []), newCard],
        };

        try {
            const response = await fetch(`${apiBaseUrl}/api/decks/${deckId}/add-cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to add card');
            }

            const updatedDeck = await response.json();
            setDeck(updatedDeck.deck); // Update the deck with the new card
            setNewCard({ name: '', front: '', back: '' }); // Clear the input fields
        } catch (err) {
            console.log(err);
        }
    };

    // Handle card deletion
    const handleDeleteCard = async (cardId: string) => {
        if (!deck) return; // Ensure deck is not null or undefined before proceeding

        // Create a copy of the deck to avoid mutating the state directly
        const updatedDeck = { ...deck };

        // Filter out the card by its unique cardId
        updatedDeck.cards = updatedDeck.cards.filter(card => card._id !== cardId);

        // Update the deck with the new filtered cards array
        
        const payload = {
            cards: updatedDeck.cards
        };

        try {
            const response = await fetch(`${apiBaseUrl}/api/decks/${deckId}/add-cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to add card');
            }
            const updatedDeck = await response.json();
            setDeck(updatedDeck.deck); // Update the deck with the new card
        } catch (err) {
            console.log(err);
        }
    };

    if (!deck) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="grid grid-cols-12 gap-4 mt-10">
                <div className="col-start-3 col-end-10">
                    <Card>
                        <CardHeader>
                            <CardTitle>Deck View</CardTitle>
                            <CardDescription>
                                Deck Name: {deck.name} (Deck ID: {deck._id})
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Render existing cards */}
                            <div>
                                {deck.cards.length > 0 ? (
                                    deck.cards.map((card, index) => (
                                        <div key={index} className="mb-4">
                                            <div className="border p-4 mb-2">
                                                <strong>{card.name}</strong>
                                                <div className="mt-2">
                                                    <p><strong>Front:</strong> {card.front}</p>
                                                    <p><strong>Back:</strong> {card.back}</p>
                                                </div>
                                                {/* Small Delete Button Aligned to the Right */}
                                                <button
                                                    onClick={() => handleDeleteCard(card._id || '')}
                                                    className="mt-2 bg-red-500 text-white text-sm p-1 rounded ml-auto"
                                                >
                                                    Delete Card
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No cards available for this deck.</p>
                                )}
                            </div>

                            {/* Form for adding a new card */}
                            <div className="mt-6">
                                <h3 className="text-xl font-bold">Add a New Card</h3>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        name="front"
                                        placeholder="Front of Card"
                                        value={newCard.front}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded"
                                    />
                                    <input
                                        type="text"
                                        name="back"
                                        placeholder="Back of Card"
                                        value={newCard.back}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded"
                                    />
                                    <button
                                        onClick={handleAddCard}
                                        className="mt-4 bg-blue-500 text-white p-2 rounded"
                                    >
                                        Add Card
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleReturnToDashboard}> Return to Dashboard</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}
