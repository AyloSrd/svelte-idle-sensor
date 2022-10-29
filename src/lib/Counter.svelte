<script>
    let count = 0
</script>

<button on:click={() => count += 1}>
   <label>+</label>
</button>
<span>{count}</span>