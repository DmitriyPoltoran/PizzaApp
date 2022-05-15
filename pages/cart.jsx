import styles from "../styles/Cart.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/router";
import { reset } from "../redux/cartSlice";
import axios from "axios";
import OrderDetail from "../components/OrderDetail";

const Cart = () => {
  const [open, setOpen] = useState(false);
  const [cash, setCash] = useState(false);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const amount = cart.total;
  const currency = "USD";
  const style = { layout: "vertical" };
  const router = useRouter();


  const createOrder = async (data) => {
    try {
      const res = await axios.post("http://localhost:3000/api/orders", data);
      console.log(res.data._id);
      res.status === 201 && router.push(`/orders/${res.data._id}`);
      dispatch(reset());
    } catch (err) {
      console.log(err);
    }
  };

  // Custom component to wrap the PayPalButtons and handle currency changes
  const ButtonWrapper = ({ currency, showSpinner }) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
      dispatch({
        type: "resetOptions",
        value: {
          ...options,
          currency: currency,
        },
      });
    }, [currency, showSpinner]);

    return (
      <>
        {showSpinner && isPending && <div className="spinner" />}
        <PayPalButtons
          style={style}
          disabled={false}
          forceReRender={[amount, currency, style]}
          fundingSource={undefined}
          createOrder={(data, actions) => {
            return actions.order
              .create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount,
                    },
                  },
                ],
              })
              .then((orderId) => {
                // Your code here after create the order
                return orderId;
              });
          }}
          onApprove={function (data, actions) {
            return actions.order.capture().then(function (details) {
              const shipping = details.purchase_units[0].shipping;

              createOrder({
                customer: shipping.name.full_name,
                address: shipping.address.address_line_1,
                total: cart.total,
                method: 1,
              });
            });
          }}
        />
      </>
    );
  };

  return (
    <div onClick={()=> {setCash(!cash)}} className={styles.container}>
      <div className={styles.left}>
        <div className={styles.row}>
          <span className={styles.td}>Product</span>
          <span className={styles.td}>Name</span>
          <span className={styles.td}>Extras</span>
          <span className={styles.td}>Price</span>
          <span className={styles.td}>Quantity</span>
          <span className={styles.td}>Total</span>
        </div>
        {cart.products.map((product) => (
          <div className={styles.row}>
            <div className={styles.imgContainer}>
              <Image src={product.img} layout="fill" objectFit="cover" alt="" />
            </div>

            <div className={styles.td}>
              <p className={styles.name}>{product.title}</p>
            </div>

            <span className={styles.td}>
              {product.extras.map((extra) => (
                <div key={extra._id}>{extra.text}, </div>
              ))}
            </span>

            <div className={styles.td}>
              <p className={styles.price}>${product.price}</p>
            </div>

            <div className={styles.td}>
              <p className={styles.quantity}>{product.quantity}</p>
            </div>

            <div className={styles.td}>
              <p className={styles.total}>
                ${product.price * product.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.right}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>CART TOTAL</h2>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Subtotal:</b>${cart.total}
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Discount:</b>$0.00
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Total:</b>${cart.total}
          </div>
          {false ? (
            <div className={styles.paymentMethods}>
              <button
                className={styles.payButton}
                onClick={() => setCash(true)}
              >
                CASH ON DELIVERY
              </button>
              <PayPalScriptProvider
                options={{
                  "client-id":
                    "ASRPryYHUdBZhT56K0kl4y067ZTAQFmO6f-487h2R4Rw45OjBdvoXBkbKSUPMHv1S4OO7rfMjl30wvAt",
                  components: "buttons",
                  currency: "USD",
                  "disable-funding": "credit,card,p24",
                }}
              >
                <ButtonWrapper currency={currency} showSpinner={false} />
              </PayPalScriptProvider>
            </div>
          ) : (
            <button onClick={() => setOpen(true)} className={styles.button}>
              CHECKOUT NOW!
            </button>
          )}
        </div>
      </div>
      {cash && (
        <OrderDetail
          total={cart.total}
          createOrder={createOrder}
          closeCard={() => {
            if (cash) setCash(false);
          }}
        />
      )}
    </div>
  );
};

export default Cart;
