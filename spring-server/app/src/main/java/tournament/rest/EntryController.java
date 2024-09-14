package tournament.rest;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import tournament.model.Entry;
import tournament.service.EntryService;

@RestController
public class EntryController {
    private static final Logger logger = LoggerFactory.getLogger(EntryController.class);

    private EntryService entryService;

    @Autowired
    public EntryController(EntryService entryService) {
        this.entryService = entryService;
    }

    // Search entries by line1 and line2
    @GetMapping("/entry/search")
    public List<Entry> search(@RequestParam String type, @RequestParam(required = false) String line1, @RequestParam(required = false) String line2) {
        logger.info("GET request to search entries for type={}, line1={} and line2={}", type, line1, line2);
        return entryService.search(type, line1, line2);
    }
}
