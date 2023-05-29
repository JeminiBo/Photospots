import React from 'react';
import { Button, Text, View } from 'react-native';
import { usePurchaseWithHistory } from '../../hooks/usePurchaseWithHistory';

const Purchase = () => {
  const {
    products,
    subscriptions,
    handlePurchase,
    handleSubscription,
    isUserHaveSubscription,
    isSubscriptionsLoaded,
  } = usePurchaseWithHistory();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {products.map((product) => (
        <View key={product.productId}>
          <Text>{product.productId}</Text>

          <Button
            title="Buy"
            onPress={() => handlePurchase(product.productId)}
          />
        </View>
      ))}

      {subscriptions.map((subscription) => (
        <View key={subscription.productId}>
          <Text>{subscription.productId}</Text>

          <Button
            title="Buy"
            onPress={() =>
              handleSubscription(
                subscription.productId,
                subscription.subscriptionOfferDetails[0].offerToken,
              )
            }
          />
        </View>
      ))}
    </View>
  );
};

export { Purchase };
