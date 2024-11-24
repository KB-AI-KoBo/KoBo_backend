package com.kb.kobo.program.dto;

import com.kb.kobo.program.domain.Program;

import java.util.List;

public class ProgramResponse {
    private List<Program> data;

    public List<Program> getData() {
        return data;
    }

    public void setData(List<Program> data) {
        this.data = data;
    }
}

