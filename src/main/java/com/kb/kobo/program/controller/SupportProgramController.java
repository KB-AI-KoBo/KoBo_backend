package com.kb.kobo.program.controller;

import com.kb.kobo.program.domain.Program;
import com.kb.kobo.program.service.SupportProgramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/support-programs")
public class SupportProgramController {

    private final SupportProgramService supportProgramService;

    @Autowired
    public SupportProgramController(SupportProgramService supportProgramService) {
        this.supportProgramService = supportProgramService;
    }

    @GetMapping
    public ResponseEntity<List<Program>> getPrograms(
            @RequestParam(required = false) String 분야,
            @RequestParam(required = false) String 소관기관,
            @RequestParam(required = false) String 신청시작일자,
            @RequestParam(required = false) String 신청종료일자) {
        List<Program> programs = supportProgramService.getFilteredPrograms(분야, 소관기관, 신청시작일자, 신청종료일자);
        return ResponseEntity.ok(programs);
    }

}
