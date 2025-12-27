package beans;

import entities.Result;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceContextType;
import jakarta.transaction.Transactional;  // ПРАВИЛЬНЫЙ ИМПОРТ!
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Named("resultsBean")
@ApplicationScoped
public class ResultsBean implements Serializable {

    @PersistenceContext
    private EntityManager entityManager;

    private List<Result> results = new ArrayList<>();

    @PostConstruct
    public void init() {
        System.out.println("=== ResultsBean: Инициализация ===");
        loadResults();
    }

    @Transactional  // Теперь должно работать!
    public void addResult(Result result) {
        System.out.println("ResultsBean: Сохранение результата: " + result);

        try {
            entityManager.persist(result);
            results.add(0, result);
            System.out.println("ResultsBean: Результат успешно сохранен");
        } catch (Exception e) {
            System.err.println("ResultsBean: ОШИБКА сохранения: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void loadResults() {
        try {
            results = entityManager.createQuery(
                    "SELECT r FROM Result r ORDER BY r.checkTime DESC",
                    Result.class
            ).getResultList();
            System.out.println("ResultsBean: Загружено " + results.size() + " результатов");
        } catch (Exception e) {
            System.err.println("ResultsBean: ОШИБКА загрузки: " + e.getMessage());
            results = new ArrayList<>();
        }
    }

    @Transactional  // И здесь тоже!
    public void clearResults() {
        System.out.println("ResultsBean: Очистка всех результатов...");

        try {
            int deletedCount = entityManager.createQuery("DELETE FROM Result")
                    .executeUpdate();
            results.clear();
            System.out.println("ResultsBean: Удалено " + deletedCount + " записей");
        } catch (Exception e) {
            System.err.println("ResultsBean: ОШИБКА очистки: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @PreDestroy
    public void destroy() {
        System.out.println("=== ResultsBean: Очистка ресурсов ===");
    }

    // Геттеры
    public List<Result> getResults() {
        if (results.isEmpty()) {
            loadResults();
        }
        return results;
    }

    public String getStatus() {
        return "ResultsBean активен. Записей: " + results.size();
    }
}