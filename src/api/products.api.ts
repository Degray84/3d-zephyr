import { getDatabase, ref as fireRef, query, limitToLast, onValue } from 'firebase/database';

export const fetchProducts = () => {
    const db = getDatabase();
    const recentPostsRef = query(fireRef(db, 'products'), limitToLast(100));

    return new Promise(resolve => onValue(recentPostsRef, result => resolve(result.val())))
};