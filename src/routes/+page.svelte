<script lang="ts">
	import { getCurrencies } from '../lib/api/fetch.js';
	import { Convert } from '../lib/conversion.js';

	let amount = $state(0);
	let from = $state('usd');
	let to = $state('usd');
	let result = $state('');
	let error = $state('');
	let currencies = $state<string[]>([]); 
	let exchangeRates = $state<Record<string, number>>({});
	let selectedDate = $state<string>(new Date().toISOString().split('T')[0]);

	$effect(() => {
		getCurrencies(selectedDate)
			.then((data) => {
				if (data.usd) {
					currencies = Object.keys(data.usd);
					exchangeRates = data.usd;
				} else {
					error = 'Invalid data structure';
				}
			})
			.catch(() => (error = 'Failed to fetch currencies'));
	});

	$effect(() => {
		if (!amount || isNaN(amount)) {
			error = 'Enter a valid amount';
			result = '';
			return;
		}

		const { result: convertedAmount, error: conversionError } = Convert(
			amount,
			from,
			to,
			exchangeRates
		);
		error = '';
		result = convertedAmount;
		error = conversionError;
	});
</script>
<div class="body">
<div class="container">
  <h2>Currency Converter</h2>
  <div class="input-group">
    <select bind:value={from}>
      {#each currencies as currency}
        <option value={currency}>{currency.toUpperCase()}</option>
      {/each}
    </select>
    <select bind:value={to}>
      {#each currencies as currency}
        <option value={currency}>{currency.toUpperCase()}</option>
      {/each}
    </select>
  </div>

  <div class="input-group">
    <input type="number" bind:value={amount} placeholder="Amount" />
    <input type="date" bind:value={selectedDate} max={new Date().toISOString().split('T')[0]} />
  </div>

  {#if result}
    <p class="result">
      <span class="amount">{result}</span>
      <span class="currency">{to.toUpperCase()}</span>
      <span class="date">on {selectedDate}</span>
    </p>
  {/if}

  {#if error}
    <p class="error">⚠️ {error}</p>
  {/if}
</div>
</div>

<style lang="postcss">
@import './styles.css';
</style>

