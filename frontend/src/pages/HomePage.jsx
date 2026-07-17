import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);

  const getAllNotes = async () => {
    const response = await api.get("/notes");
    return response.data;
  };

  const { data: notes, isLoading: notesLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: getAllNotes,
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {notesLoading && (
          <div className="text-center text-primary py-10">Loading notes...</div>
        )}

        {notes?.length === 0 && !isRateLimited && <NotesNotFound />}

        {notes?.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
