// src/pages/Home/index.tsx
import Layout from "@/components/layout";
import * as React from "react";
import { PlusCircle, Image as ImageIcon } from "lucide-react"; // Added ImageIcon for placeholder
import { Post, PostFormData, User } from "./post.types"; // Ensure this path is correct
import { PostCard } from "@/components/posts/PostCard";
import { PostFormModal } from "@/components/modals/PostFormModal";
import { ReauthenticationModal } from "@/components/modals/ReauthenticationModal";
import { useUserAuth } from "@/context/userAuthContext";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

// --- Import your post service functions ---
import { getAllPosts, createPost, updatePost } from "@/services/postService"; // Adjust path

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const { user } = useUserAuth();
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = React.useState(true);
  const [postsFetchError, setPostsFetchError] = React.useState<string | null>(null);

  // Post Form Modal State
  const [isPostFormModalOpen, setIsPostFormModalOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<Post | null>(null);

  // Re-authentication Modal State
  const [isReauthModalOpen, setIsReauthModalOpen] = React.useState(false);
  const [reauthError, setReauthError] = React.useState<string | null>(null);
  const [isReauthProcessing, setIsReauthProcessing] = React.useState(false);

  const [pendingAction, setPendingAction] = React.useState<{
    type: 'create' | 'edit';
    data: PostFormData;
    originalPostId?: string;
  } | null>(null);

  // --- Data Fetching ---
  const fetchPosts = React.useCallback(async () => {
    setIsLoadingPosts(true);
    setPostsFetchError(null);
    try {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
    } catch (error: any) {
      console.error("Failed to fetch posts:", error);
      setPostsFetchError(error.message || "Could not load posts.");
    } finally {
      setIsLoadingPosts(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); // Fetch posts on component mount

  // --- Post Form Modal Handlers ---
  const openCreatePostModal = () => {
    setEditingPost(null);
    setIsPostFormModalOpen(true);
  };

  const openEditPostModal = (post: Post) => {
    setEditingPost(post);
    setIsPostFormModalOpen(true);
  };

  const closePostFormModal = () => {
    setIsPostFormModalOpen(false);
    setEditingPost(null);
  };

  // --- Re-authentication and Action Execution ---
  const handlePostFormSubmit = (formData: PostFormData) => {
    setPendingAction({
      type: editingPost ? 'edit' : 'create',
      data: formData,
      originalPostId: editingPost?.id,
    });
    setIsReauthModalOpen(true);
    setReauthError(null);
    closePostFormModal();
  };

  const executePostAction = async () => {
    if (!pendingAction || !user) {
        // This case should ideally be prevented by UI (e.g. disabling buttons)
        console.error("Pending action or user is not available.");
        setPendingAction(null); // Clear pending action
        return;
    }

    const { type, data, originalPostId } = pendingAction;
    const authorName = user.displayName || user.email || "Anonymous";

    try {
        if (type === 'create') {
            console.log("Attempting to CREATE post (after re-auth):", data);
            await createPost(data, user.uid, authorName);
            // TODO: Optionally handle the returned newPostId from createPost if needed
        } else if (type === 'edit' && originalPostId) {
            console.log("Attempting to EDIT post (after re-auth):", originalPostId, data);
            await updatePost(originalPostId, data);
        }
        fetchPosts(); // Re-fetch posts to show the latest data
    } catch (error: any) {
        console.error(`Failed to ${type} post:`, error);
        // Optionally set an error state to display to the user for the specific action
        setPostsFetchError(`Failed to ${type} post. ${error.message || ''}`);
    } finally {
        setPendingAction(null);
    }
  };

  const handleReauthConfirm = async (email: string, password: string) => {
    if (!user) {
      setReauthError("User not available. Please sign in again.");
      return;
    }
    setIsReauthProcessing(true);
    setReauthError(null);
    try {
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(user, credential);
      console.log("Re-authentication successful for post action.");
      setIsReauthModalOpen(false);
      await executePostAction();
    } catch (error: any) {
      console.error("Re-authentication failed:", error);
      setReauthError(error.message || "Failed to re-authenticate. Check credentials.");
    } finally {
      setIsReauthProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Community Posts</h1>
          {user && (
            <button
              onClick={openCreatePostModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center text-sm sm:text-base"
            >
              <PlusCircle size={20} className="mr-2" /> Create Post
            </button>
          )}
        </div>

        {isLoadingPosts ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">Loading posts...</p>
            {/* You can add a spinner here */}
          </div>
        ) : postsFetchError ? (
          <div className="text-center py-12 p-4 bg-red-50 text-red-700 rounded-lg">
            <p className="text-xl font-semibold">Could not load posts</p>
            <p className="mt-1">{postsFetchError}</p>
            {/* <Button onClick={fetchPosts} className="mt-4">Try Again</Button> */}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon size={60} className="mx-auto mb-6 text-gray-400" />
            <p className="text-xl text-gray-500">No posts yet.</p>
            {user && <p className="text-gray-500 mt-2">Be the first to share something!</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={user}
                onEdit={openEditPostModal}
              />
            ))}
          </div>
        )}
      </div>

      <PostFormModal
        isOpen={isPostFormModalOpen}
        onClose={closePostFormModal}
        onSubmit={handlePostFormSubmit}
        initialData={editingPost 
            ? { title: editingPost.title, content: editingPost.content, imageUrl: editingPost.imageUrl } 
            : undefined} // Pass undefined for create
        isSaving={isReauthProcessing || (pendingAction !== null)}
      />

      <ReauthenticationModal
        isOpen={isReauthModalOpen}
        onClose={() => {
            setIsReauthModalOpen(false);
            setPendingAction(null);
        }}
        onConfirm={handleReauthConfirm}
        actionName={pendingAction?.type === 'create' ? 'create this post' : 'save these changes'}
        isProcessing={isReauthProcessing}
        error={reauthError}
        defaultEmail={user?.email || ''}
      />
    </Layout>
  );
};

export default Home;