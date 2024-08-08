const conf = {
  appwriteUrl: String(process.env.NEXT_PUBLIC_APPWRITE_URL),

  appwriteProjectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),

  appwriteCollectionUserPrefsId: String(process.env.NEXT_PUBLIC_APPWRITE_USER_CONFIG_COLLECTION_ID),
  appwriteCollectionMusicConfigId: String(process.env.NEXT_PUBLIC_APPWRITE_MUSIC_CONFIG_COLLECTION_ID),
  appwriteCollectionMusicPlayListId: String(process.env.NEXT_PUBLIC_APPWRITE_MUSIC_PLAYLIST_COLLECTION_ID),
  appwriteCollectionPlayListByUserId: String(process.env.NEXT_PUBLIC_APPWRITE_MUSIC_PLAYLIST_BY_USER_COLLECTION_ID),


  appwriteMusicBucketId: String(process.env.NEXT_PUBLIC_APPWRITE_MUSIC_BUCKET_ID),
  appwriteAvatarBucketId: String(process.env.NEXT_PUBLIC_APPWRITE_AVATAR_BUCKET_ID),

  secreteKey: String(process.env.NEXT_PUBLIC_SECRET_KEY),

};

export default conf;
