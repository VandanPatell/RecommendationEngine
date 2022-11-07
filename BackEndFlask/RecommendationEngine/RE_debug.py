# RecommendationEngine.py
# Author: Vandan Sojitra(vandanp89@gmail.com)
# Find more documentation about API on https://documenter.getpostman.com/view/15905776/2s7YYr9kSK

import pandas as pd
import mlxtend
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori
from mlxtend.frequent_patterns import association_rules
import requests


class Recommend:
    def __init__(self, min_threshold=0.5):
        self._url = 'https://script.google.com/macros/s/AKfycbwesrsULT_ERfAPmqsTAaX34zWTqhdMRHa0ytCsJzdlF8lyvR7gVOGInOtmcTLa48U/exec'
        self.action = "getAllOrdersList_CSV"
        self.min_threshold = min_threshold
        self._APIurl = self._url + "?action="

    def getDataFrame(self):
        self.__dataFrame = pd.read_csv(
            self._APIurl+self.action, header=None, names=['products'])
        data = list(self.__dataFrame["products"].apply(lambda x: x.split(',')))

        return data

    def TransactionEncoder(self):

        data = self.getDataFrame()

        te = TransactionEncoder()
        te_data = te.fit(data).transform(data)
        df = pd.DataFrame(te_data, columns=te.columns_)

        self.allProducts = te.columns_

        return df

    def applyApriori(self):
        df = self.TransactionEncoder()
        df_apr = apriori(df, min_support=0.01, use_colnames=True, verbose=0)
        df_apr['length'] = df_apr['itemsets'].apply(lambda x: len(x))

        return df_apr

    def applyAssociation(self):

        df_apr = self.applyApriori()
        result = association_rules(
            df_apr, metric="confidence", min_threshold=self.min_threshold)

        return result

    def recommend(self, user_id: str):
        PARAMS = {'action': "getCartDetails"}
        postData = {'cust_id': user_id}
        data = requests.post(url=self._url, params=PARAMS,
                             json=postData).json()

        cart_items = [str(i) for i in data['data']['cartItems']]

        if(len(cart_items) == 0):
            pass

        # Extracting the products from associationRule generated

        association_rule = self.applyAssociation()

        req_list = []
        for i in association_rule['antecedents']:
            for j in cart_items:
                if j in i:
                    req_list.append(i)

        a = association_rule[association_rule['antecedents'].isin(req_list)]
        a.sort_values(by='confidence', ascending=False).drop_duplicates()

        lst = []
        for i in a['consequents']:
            lst.append(list(i))

        recommendation = []
        for ele in lst:
            for i in ele:
                if (i not in recommendation) and (i not in cart_items):
                    recommendation.append(i)

        PARAMS = {'action': "getProductsByIdList"}
        postData = {'product_list': recommendation}
        rec_data = requests.post(url=self._url, params=PARAMS,
                             json=postData).json()


        res = {'cart_items': cart_items, 'recommendation': rec_data['data']}
        return res

    def greet(self):
        print("Hello i am Recommend from re_debug")
