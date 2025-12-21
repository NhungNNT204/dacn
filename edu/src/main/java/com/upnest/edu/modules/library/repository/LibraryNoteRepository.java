package com.upnest.edu.modules.library.repository;

import com.upnest.edu.modules.library.entity.LibraryNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LibraryNoteRepository extends JpaRepository<LibraryNote, Long> {
    Optional<LibraryNote> findByUserIdAndLibraryItemId(Long userId, Long libraryItemId);
}

