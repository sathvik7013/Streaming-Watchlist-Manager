package com.watchlist.service;

import com.watchlist.model.Content;
import com.watchlist.model.enums.ContentType;
import com.watchlist.repository.ContentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContentService {

    private final ContentRepository contentRepository;

    public ContentService(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    public List<Content> getAllContent() {
        return contentRepository.findAll();
    }

    public Content getContentById(Long id) {
        return contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found with id: " + id));
    }

    public List<Content> searchContent(String keyword) {
        return contentRepository.searchByTitleOrDescription(keyword);
    }

    public List<Content> getContentByType(ContentType type) {
        return contentRepository.findByType(type);
    }

    public List<Content> getContentByGenre(String genre) {
        return contentRepository.findByGenreContainingIgnoreCase(genre);
    }

    public List<Content> getContentByPlatform(String platform) {
        return contentRepository.findByPlatformIgnoreCase(platform);
    }

    public Content addContent(Content content) {
        return contentRepository.save(content);
    }

    public Content updateContent(Long id, Content updated) {
        Content content = getContentById(id);
        content.setTitle(updated.getTitle());
        content.setDescription(updated.getDescription());
        content.setType(updated.getType());
        content.setGenre(updated.getGenre());
        content.setPlatform(updated.getPlatform());
        content.setReleaseYear(updated.getReleaseYear());
        content.setPosterUrl(updated.getPosterUrl());
        content.setAverageRating(updated.getAverageRating());
        content.setTotalEpisodes(updated.getTotalEpisodes());
        return contentRepository.save(content);
    }

    public void deleteContent(Long id) {
        contentRepository.deleteById(id);
    }
}
