package entities;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * JPA Entity класс для хранения результатов проверок.
 * Соответствует таблице "results" в базе данных PostgreSQL.
 *
 * Аннотации:
 * @Entity - отмечает класс как JPA entity
 * @Table(name = "results") - указывает имя таблицы в БД
 * @Id + @GeneratedValue - первичный ключ с автоинкрементом
 * @Column - маппинг полей на колонки таблицы
 */


@Entity
@Table(name = "results")
public class Result implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "x_value", nullable = false)
    private double x;

    @Column(name = "y_value", nullable = false)
    private double y;

    @Column(name = "radius", nullable = false)
    private double r;

    @Column(name = "hit", nullable = false)
    private boolean hit;

    @Column(name = "check_time", nullable = false)
    private LocalDateTime checkTime;

    // Конструкторы
    public Result() {
        this.checkTime = LocalDateTime.now();  // или this.timestamp
    }

    public Result(double x, double y, double r, boolean hit) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.checkTime = LocalDateTime.now();  // или this.timestamp
    }

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public double getR() {
        return r;
    }

    public void setR(double r) {
        this.r = r;
    }

    public boolean isHit() {
        return hit;
    }

    public void setHit(boolean hit) {
        this.hit = hit;
    }

    // Геттер для времени - ВАЖНО: используйте либо checkTime, либо timestamp
    public LocalDateTime getCheckTime() {
        return checkTime;
    }

    public void setCheckTime(LocalDateTime checkTime) {
        this.checkTime = checkTime;
    }

    // Метод для получения времени как строки (опционально)
    public String getFormattedCheckTime() {
        if (checkTime != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
            return checkTime.format(formatter);
        }
        return "";
    }

    // Метод для отображения попадания
    public String getHitText() {
        return hit ? "Попадание" : "Промах";
    }

    // toString() метод
    @Override
    public String toString() {
        return String.format("Result{id=%d, x=%.2f, y=%.2f, r=%.2f, hit=%s, time=%s}",
                id, x, y, r, hit, checkTime != null ? checkTime.toString() : "null");
    }
}