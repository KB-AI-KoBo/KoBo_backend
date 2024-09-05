package com.kb.kobo.controller;

import com.kb.kobo.entity.Question;
import com.kb.kobo.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    @Autowired
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping("/submit")
    public ResponseEntity<Question> submitQuestion(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(value = "documentId", required = false) Long documentId,
            @RequestParam("content") String content) {

        System.out.println("submitQuestion 호출됨");

        try {
            Question question = questionService.submitQuestion(documentId, user.getUsername(), content);
            System.out.println("질문 제출 성공! 질문 : " + question.getContent());
            return new ResponseEntity<>(question, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        return questionService.findQuestionById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
        try {
            questionService.deleteQuestion(id);
            return new ResponseEntity<>("질문이 성공적으로 삭제되었습니다.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("질문 삭제에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
