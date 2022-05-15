import React from "react";
import styles from "../styles/PizzaList.module.css";
import PizzaCard from "./PizzaCard";

const PizzaList = ({ pizzaList }) => {
  return (
    <div className={styles.PizzaList}>
      <div className={styles.container}>
        <h1 className={styles.title}>THE BEST PIZZA IN TOWN</h1>
        <p className={styles.desc}>
          When you think about your comfort food what comes to your mind? Among
          a lot of dishes to choose from, pizza has always been the go-to food
          for every mood and occasion. When hunger strikes and your stomach
          looks for something quick and tasty, pizza seeks the winning position.
          On days of celebration or trouble, the warm steam from a pizza box
          gives a certain feeling of relief and solace. Admit it — there is a
          little excitement whenever you hear the doorbell ring, and see a
          familiar guy with a cap, holding a warm box (or boxes, no judgment) of
          pizza. With this list are a number of reasons, among a thousand — why
          you should definitely order pizza
        </p>
        <div className={styles.wrapper}>
          {pizzaList.map((pizza) => (
            <PizzaCard key={pizza._id} pizza={pizza} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PizzaList;
