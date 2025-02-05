<script lang="ts">
	import { getCurrencies } from '../lib/api/fetch.js';
	import { Convert } from '../lib/conversion.js';

	// User input states
	let amount = $state(0); // Amount to be converted
	let from = $state('usd'); // Primary currency
	let to = $state('usd'); // Target currency
	let result = $state(''); // Conversion result
	let error = $state(''); // Stores any error message

	// Exchange rate data
	let currencies = $state<string[]>([]); // List of available currencies
	let exchangeRates = $state<Record<string, number>>({}); // Holds exchange rates

	// Date selection for fetching historical exchange rates
	let selectedDate = $state<string>(new Date().toISOString().split('T')[0]);

	// Fetch exchange rates whenever the selected date changes
	$effect(() => {
		getCurrencies(selectedDate)
			.then((data) => {
				if (data.usd) {
					currencies = Object.keys(data.usd); // Extract available currency codes
					exchangeRates = data.usd; // Store exchange rates for USD base
				} else {
					error = 'Invalid data structure'; // Unexpected API response format
				}
			})
			.catch(() => (error = 'Failed to fetch currencies')); // Handle network or API errors
	});

	// Perform conversion when relevant states change
	$effect(() => {
		if (!amount || isNaN(amount)) {
			error = 'Enter a valid amount';
			result = '';
			return;
		}

		// Convert currency based on the selected exchange rates
		const { result: convertedAmount, error: conversionError } = Convert(
			amount,
			from,
			to,
			exchangeRates
		);

		error = conversionError || ''; // Store error if conversion fails
		result = convertedAmount; // Update conversion result
	});
</script>

<div class="body">
	<div class="container">
		<h2>Currency Converter</h2>

		<!-- Currency selection dropdowns -->
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

		<!-- Amount input and date selection -->
		<div class="input-group">
			<input type="number" bind:value={amount} placeholder="Amount" />
			<input type="date" bind:value={selectedDate} max={new Date().toISOString().split('T')[0]} />
		</div>

		<!-- Display conversion result -->
		{#if result}
			<p class="result">
				<span class="amount">{result}</span>
				<span class="currency">{to.toUpperCase()}</span>
				<span class="date">on {selectedDate}</span>
			</p>
		{/if}

		<!-- Display error messages -->
		{#if error}
			<p class="error">⚠️ {error}</p>
		{/if}
	</div>
</div>

<style lang="postcss">
	@import './styles.css';
</style>
