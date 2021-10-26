import pandas as pd
import numpy as np
from pypfopt import EfficientFrontier, risk_models, expected_returns

import os
import json
from http.server import BaseHTTPRequestHandler, HTTPServer

def optimize(data):
    mu = expected_returns.mean_historical_return(data)
    S = risk_models.sample_cov(data)

    # Optimise for maximal Sharpe ratio
    ef = EfficientFrontier(mu, S)
    ef.max_sharpe()
    cleaned_weights = ef.clean_weights()
    weights = np.array(list(cleaned_weights.values()))
    folio = (data.iloc[:,:] * weights).sum(axis = 1)
    perf = ef.portfolio_performance()
    return weights, folio, perf

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            length = int(self.headers.get('Content-length'))
            body = json.loads(self.rfile.read(length))

            tickers = body['tickers']
            rolling_period = body['rollingPeriod']

            response = {}

            snp = pd.read_csv('data.csv', index_col = 0)

            data = snp[tickers]

            weights, portfolio, performance = optimize(data)
            annualized_return, annualized_volatility, sharpe_ratio = performance

            portfolio_growth = (portfolio / portfolio.iloc[0] - 1) * 100
            stock_growth = (data / data.iloc[0,:] - 1) * 100

            # Information
            response['annualizedReturn'] = annualized_return
            response['annualizedVolatility'] = annualized_volatility
            response['sharpeRatio'] = sharpe_ratio

            # Pie chart
            response['resourceAllocation'] = {ticker: weight for ticker, weight in zip(tickers, weights)}

            # Relative growth graph
            response['portfolioRelativeGrowth'] = portfolio_growth.to_dict()
            response['stockRelativeGrowth'] = stock_growth.to_dict()

            # Daily returns and rolling volatility graph
            response['dailyReturns'] = portfolio.pct_change().dropna().to_dict()
            response['rollingVolatility'] = portfolio.pct_change().rolling(rolling_period).std().dropna().to_dict()

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            self.wfile.write(bytes(json.dumps(response), 'utf-8'))
            return
        except:
            self.send_response(500)
            self.end_headers()
            return

with HTTPServer(('localhost', 8001), Handler) as server:
    server.serve_forever()
    print('Starting server')
