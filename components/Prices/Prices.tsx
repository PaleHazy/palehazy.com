import React, { useState, useEffect } from 'react';


const Prices = () => {
  const [prices, setPrices] = useState<any[]>([]);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      const {prices} = await fetch('/api/prices').then(r => r.json());
      setPrices(prices);
    };
    fetchPrices();
  }, [])

  const createSubscription = async (priceId: StringConstructor) => {
    const {subscriptionId, clientSecret} = await fetch('/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId
      }),
    }).then(r => r.json());

    setSubscriptionData({ subscriptionId, clientSecret });
  }

  // if(subscriptionData) {
  //   return <Redirect to={{
  //     pathname: '/subscribe',
  //     state: subscriptionData
  //   }} />
  // }

  return (
    <div>
      <h1>Select a plan</h1>

      <div className="price-list">
        {prices.map((price) => {
          return (
            <div key={price.id}>
              <h3>{price.product.name}</h3>

              <p>
                ${price.unit_amount / 100} / month
              </p>

              <button onClick={() => createSubscription(price.id)}>
                Select
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default Prices;