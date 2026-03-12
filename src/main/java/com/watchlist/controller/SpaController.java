package com.watchlist.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping(value = {"/login", "/register", "/browse", "/watchlist"})
    public String forward() {
        return "forward:/index.html";
    }
}
