import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { useUser } from "./UserContext";
import Logout from "./components/ui/Logout";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { useNavigate } from "react-router-dom";
import { apiBaseUrl } from "./api";

export interface Flashcard {
    question: string;
    answer: string;
}

export interface Deck {
    _id: number;
    name: string;
    description?: string;
    cards: Flashcard[];
}
export default function Dashboard(){
    const identity = useUser();
    const navigate = useNavigate();
    const deckNameInput = useRef<HTMLInputElement>(null);
    const [deckNameValue, setDeckNameValue] = useState('');
    const [decks, setDecks] = useState<Deck[]>([
      ]);
    useEffect(() => {
        const fetchDecks = async () => {

            try {
                const endpoint = apiBaseUrl + '/api/decks/user/' + identity.user?.username
                const response = await fetch(endpoint); // Replace with your API URL
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                console.log(data.decks);
                setDecks((prevDecks) => data.decks); // Update state with fetched data
                console.log(decks)
            } catch (err) {
                console.log(err); // Update error state if fetch fails
            }  
        }
        if (identity.user){
            fetchDecks();
        }
        
    },[identity])
    const handleDeckNameChange = (event: React.ChangeEvent<HTMLInputElement>)  => {
        setDeckNameValue(event.target.value);
    };


    async function handleNewDeck(){
        const deckName = deckNameInput.current?.value.trim() // Safely get the input value and trim whitespace
        
        if (deckName) {
            alert(`Deck Created: ${deckName}`);

            const newDeck: Deck = { _id: Date.now(), name: deckName, cards: [] };
            const data = { username: identity.user?.username, name: newDeck.name, cards: newDeck.cards }
            try {
                const response = await fetch(apiBaseUrl + '/api/decks/create', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            
                const result = await response.json();
            
                if (response.ok) {
                    alert("Deck Added!");
                    setDecks((prevDecks) => [...prevDecks, newDeck]);
                    navigate('/dashboard'); // Navigate to dashboard on successful login
                } else {
                    // Show error feedback and stay on /login
                    alert(`Deck Failed to Add: ${result.message || 'Invalid credentials'}`);
                }
            } catch (error) {
                if (error instanceof Error) {
                    alert(`An error occurred: ${error.message}`);
                } else {
                    alert('An unexpected error occurred.');
                }
            }
    

            setDeckNameValue('');
        } else {
            alert("Please enter a valid deck name.");
        }
    }

    async function handleEdit(deckId:number){
        if (deckId) {
            alert(`Deck Editing: ${deckId}`);
            setDeckNameValue('');
        } else {
            alert("Please enter a valid deck name.");
        }
    }

    async function handleDelete(deckId:number){
        if (deckId) {
            alert(`Deck Deleting: ${deckId}`);
            setDeckNameValue('');
        } else {
            alert("Please enter a valid deck name.");
        }
    }

    async function navigateToDeck(deckId:number){
        navigate(`/Deck?deckId=${deckId}`)
    }
    return (
    <>
    <div className="grid grid-cols-12 gap-4 mt-10">
        <div className="col-start-3 col-end-9">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Hello, {identity.user?.username}
            </h1>
        </div>
        <div className="col-start-3 col-end-9">

            <Card>
                <CardHeader>
                    <CardTitle>Flash Cards App</CardTitle>
                    <CardDescription>Dashboard</CardDescription>
                    <div className="col-start-9 col-end-10 w-full">
                        <Button onClick={handleNewDeck}  > Create a new deck</Button>
                        
                    </div>
                    <Label htmlFor="deckName">New Deck Name</Label>
                    <Input value={deckNameValue} ref={deckNameInput} onChange={handleDeckNameChange} id="deckName" type="text" />
                </CardHeader>
                <CardContent>
                    <p>Decks</p>
                    <ul>
                        {decks.map((deck) => (
                            <li key={deck._id}>
                                 <Card>
                                    <CardTitle>
                                        <div className="flex">
                                            <div className="flex-none">
                                                Deck Title: {deck.name}
                                            </div>
                                        </div>
                                    </CardTitle>
                                    <CardDescription>Cards: {deck.cards.length}</CardDescription>
                                    <CardContent>
                                        <div className="flex">
                                            <div className="flex-none">
                                                <Button onClick={() => {handleEdit(deck._id)}}> Edit </Button>
                                            </div>
                                            <div className="flex-none">
                                                <Button onClick={() => {handleDelete(deck._id)}}> Delete </Button>
                                            </div>
                                            <div className="flex-none">
                                                <Button onClick={() => {navigateToDeck(deck._id)}}> Go to Deck </Button>
                                            </div>
                                        </div>
                                        
                                    </CardContent>
                                </Card>
                            </li>
                           
                        ))}
                    </ul>
                </CardContent>
            </Card>

        </div>
        <div className="col-start-9 col-end-10 w-full">
            <Logout></Logout>
        </div>
    </div>
    
    </>
    )
}
