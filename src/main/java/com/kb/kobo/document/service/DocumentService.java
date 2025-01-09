package com.kb.kobo.document.service;

import com.kb.kobo.document.domain.Document;
import com.kb.kobo.document.domain.FileType;
import com.kb.kobo.user.domain.User;
import com.kb.kobo.document.repository.DocumentRepository;
import com.kb.kobo.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class DocumentService {

    @Value("${upload.dir}")
    private String uploadDir;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    @Autowired
    public DocumentService(DocumentRepository documentRepository,UserRepository userRepository) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Document uploadAndSaveDocument(MultipartFile file, String username) throws IOException {
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            throw new RuntimeException("파일 저장 경로가 존재하지 않습니다.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new RuntimeException("파일의 이름이 유효하지 않습니다.");
        }

        FileType fileType = determineFileType(originalFilename);

        String uniqueFileName = UUID.randomUUID() + originalFilename.substring(originalFilename.lastIndexOf("."));
        Path filePath = uploadPath.resolve(uniqueFileName);

        try (var inputStream = file.getInputStream()) {
            Files.copy(inputStream, filePath);
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Document document = new Document();
        document.setUser(user);
        document.setDocumentName(originalFilename);
        document.setDocumentType(fileType);
        document.setDocumentPath(uniqueFileName);

        return documentRepository.save(document);
    }

    private FileType determineFileType(String filename) {
        String lowerCaseFilename = filename.toLowerCase();
        if (lowerCaseFilename.endsWith(".pdf")) {
            return FileType.PDF;
        } else if (lowerCaseFilename.endsWith(".pptx")) {
            return FileType.PPT;
        } else if (lowerCaseFilename.endsWith(".xlsx")) {
            return FileType.EXCEL;
        } else if (lowerCaseFilename.endsWith(".docx")) {
            return FileType.WORD;
        } else {
            throw new RuntimeException("지원하지 않는 파일 형식입니다. PDF, PPT, EXCEL, WORD 파일만 업로드할 수 있습니다.");
        }
    }

    @Transactional
    public void deleteDocument(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("해당 문서를 찾을 수 없습니다."));

        Path filePath = Paths.get(uploadDir).resolve(document.getDocumentPath());

        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("파일 삭제 실패: " + e.getMessage());
        }

        documentRepository.deleteById(documentId);
    }
}
