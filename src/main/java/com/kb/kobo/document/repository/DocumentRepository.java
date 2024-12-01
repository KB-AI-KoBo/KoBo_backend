package com.kb.kobo.document.repository;

import com.kb.kobo.user.domain.User;
import com.kb.kobo.document.domain.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByUser(User user);
}
