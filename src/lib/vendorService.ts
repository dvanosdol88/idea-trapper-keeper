import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";

const COLLECTION_NAME = "vendors";

export interface VendorData {
    id?: string;
    name: string;
    type: string;
    categories: {
        [key: string]: {
            status: "green" | "yellow" | "red";
            note: string;
        };
    };
}

export const addVendor = async (vendor: Omit<VendorData, 'id'>) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...vendor,
            createdAt: Date.now()
        });
        console.log("Vendor added with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding vendor: ", e);
        throw e;
    }
};

export const subscribeToVendors = (
    callback: (vendors: VendorData[]) => void,
    onError?: (error: Error) => void
) => {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
            const vendors: VendorData[] = [];
            querySnapshot.forEach((doc) => {
                vendors.push({ id: doc.id, ...doc.data() } as VendorData);
            });
            callback(vendors);
        },
        (error) => {
            console.error("Error subscribing to vendors:", error);
            if (onError) onError(error);
        }
    );

    return unsubscribe;
};
