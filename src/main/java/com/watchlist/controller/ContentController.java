package com.watchlist.controller;

import com.watchlist.model.Content;
import com.watchlist.model.enums.ContentType;
import com.watchlist.service.ContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping
    public ResponseEntity<List<Content>> getAllContent() {
        return ResponseEntity.ok(contentService.getAllContent());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Content> getContentById(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.getContentById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Content>> searchContent(@RequestParam String keyword) {
        return ResponseEntity.ok(contentService.searchContent(keyword));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Content>> getByType(@PathVariable ContentType type) {
        return ResponseEntity.ok(contentService.getContentByType(type));
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<Content>> getByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(contentService.getContentByGenre(genre));
    }

    @GetMapping("/platform/{platform}")
    public ResponseEntity<List<Content>> getByPlatform(@PathVariable String platform) {
        return ResponseEntity.ok(contentService.getContentByPlatform(platform));
    }

    @PostMapping
    public ResponseEntity<Content> addContent(@RequestBody Content content) {
        return ResponseEntity.ok(contentService.addContent(content));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Content> updateContent(@PathVariable Long id, @RequestBody Content content) {
        return ResponseEntity.ok(contentService.updateContent(id, content));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
        contentService.deleteContent(id);
        return ResponseEntity.noContent().build();
    }
}
