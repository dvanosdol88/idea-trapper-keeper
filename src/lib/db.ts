import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Idea } from "../store/ideaStore";

const COLLECTION_NAME = "ideas";

export const addIdea = async (idea: Omit<Idea, 'id'>) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...idea,
            timestamp: Date.now() // Ensure server timestamp or consistent client timestamp
        });
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

export const subscribeToIdeas = (callback: (ideas: Idea[]) => void) => {
    const q = query(collection(db, COLLECTION_NAME), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const ideas: Idea[] = [];
        querySnapshot.forEach((doc) => {
            ideas.push({ id: doc.id, ...doc.data() } as Idea);
        });
        callback(ideas);
    });

    return unsubscribe;
};

export const addNoteToIdea = async (ideaId: string, noteText: string) => {
    try {
        const note = {
            id: crypto.randomUUID(),
            text: noteText,
            timestamp: Date.now()
        };

        const ideaRef = doc(db, COLLECTION_NAME, ideaId);
        await updateDoc(ideaRef, {
            notes: arrayUnion(note)
        });
        return note;
    } catch (e) {
        console.error("Error adding note: ", e);
        throw e;
    }
};
