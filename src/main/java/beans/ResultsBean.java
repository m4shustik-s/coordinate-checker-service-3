package beans;

import entities.Result;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Named
@ApplicationScoped
public class ResultsBean {
    private List<Result> results = new ArrayList<>();

    public void addResult(Result result) {
        // Просто добавляем в начало списка
        results.add(0, result);
        System.out.println("✅ Добавлен результат: X=" + result.getX() +
                ", Y=" + result.getY() + ", R=" + result.getR() +
                ", Попал=" + result.isHit());
        System.out.println("Всего результатов: " + results.size());
    }

    public List<Result> getResults() {
        return results;
    }

    public void clearResults() {
        results.clear();
        System.out.println("✅ Таблица очищена");
    }
}