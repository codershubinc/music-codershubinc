
const asyncHandler = (fn: any) => (req?: any, res?: any, next?: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// A utility function to fetch avatar initials as a standalone async function
const getAvatarInitials = async (name: string): Promise<string> => {
    try {
        const ftc = await fetch(`https://api-codershubinc.vercel.app/v0.1/random_image/t/initials/${name}/svg`);
        const data = await ftc.json();

        // Log the response to confirm data structure
        console.log('image initial ', data?.data?.imageUrl);

        // Return the image URL if available, otherwise a default string
        return data?.data?.imageUrl+'&backgroundColor=000000' || 'default-avatar-url';
    } catch (error) {
        console.error('Error fetching avatar initials:', error);
        throw error;  // Let the calling code handle this error
    }
};

export default getAvatarInitials;


export { asyncHandler } 