package sample;


import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;

public class View {
	 private CheckBox exact;
	    private CheckBox euler;
	    private CheckBox ieuler;
	    private CheckBox rungeKutta;
	    private CheckBox heun;

        private Button draw;

	    public boolean isExactRequired(){
	        return exact.isSelected();
	    }

	    public boolean isEulerRquired(){
	        return euler.isSelected();
	    }

	    public boolean isIEulerRequierd(){
	        return  ieuler.isSelected();
	    }

	    public boolean isRungeKuttaRequired(){
	        return rungeKutta.isSelected();
	    }

	    public boolean isHeunRequired(){
	        return heun.isSelected();
	    }

	    public View(CheckBox exact, CheckBox euler, CheckBox ieuler, CheckBox rungeKutta,CheckBox heun ,Button draw) {
	        this.exact = exact;
	        this.euler = euler;
	        this.ieuler = ieuler;
	        this.rungeKutta = rungeKutta;
	        this.draw = draw;
	        this.heun=heun;
	    }

}
