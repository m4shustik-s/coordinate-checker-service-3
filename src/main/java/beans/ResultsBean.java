package beans;

import entities.Result;
import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Named;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Named
@SessionScoped
public class ResultsBean implements Serializable {
    private List<Result> results = new ArrayList<>();

    public void clearResults() {
        System.out.println("=== ОЧИСТКА ИСТОРИИ ===");
        System.out.println("До очистки: " + results.size() + " результатов");
        results.clear();
        System.out.println("После очистки: " + results.size() + " результатов");
        System.out.println("=== КОНЕЦ ОЧИСТКИ ===");
    }

    public void addResult(Result result) {
        results.add(0, result);
    }

    public List<Result> getResults() {
        return results;
    }

    public void setResults(List<Result> results) {
        this.results = results;
    }
}