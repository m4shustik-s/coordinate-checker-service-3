package beans;

import entities.Result;
import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import java.io.Serializable;

@Named
@SessionScoped
public class AreaCheckBean implements Serializable {
    private double x = 0;
    private double y = 0;
    private double r = 2;

    @Inject
    private ResultsBean resultsBean;

    public void checkPoint() {
        System.out.println("=== ПРОВЕРКА ТОЧКИ ===");
        System.out.println("X = " + x);
        System.out.println("Y = " + y);
        System.out.println("R = " + r);

        long startTime = System.nanoTime();
        boolean hit = checkHit(x, y, r);
        long executionTime = System.nanoTime() - startTime;

        System.out.println("Результат: " + (hit ? "ПОПАЛА" : "НЕ ПОПАЛА"));

        // Временно работаем без БД
        Result result = new Result(x, y, r, hit, executionTime);

        // Просто добавляем в список
        if (resultsBean != null) {
            resultsBean.addResult(result);
            System.out.println("✅ Результат добавлен в таблицу");
        } else {
            System.out.println("❌ ResultsBean не инициализирован!");
        }
    }

    private boolean checkHit(double x, double y, double r) {
        // 1. Четверть круга в левом верхнем квадранте радиусом R/2
        boolean inQuarterCircle = (x <= 0 && y >= 0) &&
                (x * x + y * y <= (r/2) * (r/2));

        // 2. Квадрат в правом верхнем квадранте стороной R
        boolean inSquare = (x >= 0 && x <= r) &&
                (y >= 0 && y <= r);

        // 3. Треугольник в правом нижнем квадранте: R по X и R/2 по Y
        boolean inTriangle = (x >= 0 && y <= 0) &&
                (y >= -0.5 * x) &&
                (x <= r) && (y >= -r/2);

        return inQuarterCircle || inSquare || inTriangle;
    }

    // Геттеры и сеттеры
    public double getX() { return x; }
    public void setX(double x) {
        this.x = x;
        System.out.println("X установлен: " + x);
    }

    public double getY() { return y; }
    public void setY(double y) {
        this.y = y;
        System.out.println("Y установлен: " + y);
    }

    public double getR() { return r; }
    public void setR(double r) {
        this.r = r;
        System.out.println("R установлен: " + r);
    }
}