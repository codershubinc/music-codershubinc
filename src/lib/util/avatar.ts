
const asyncHandler = (fn: any) => (req?: any, res?: any, next?: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// A utility function to fetch avatar initials as a standalone async function
const getAvatarInitials = async (name: string): Promise<string> => {
    try {


        return `https://api.dicebear.com/9.x/initials/svg?seed=${name}&backgroundColor=000000  `
    } catch (error) {
        console.error('Error fetching avatar initials:', error);
        throw error;  // Let the calling code handle this error
    }
};

export default getAvatarInitials;


export { asyncHandler } 