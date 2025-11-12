<script lang="ts">
  /**
   * 버튼 클릭 횟수를 추적하는 상태입니다.
   */
  let count: number = $state(0)
  /**
   * 카운트를 하나 증가시킵니다.
   */
  const increment = () => {
    count += 1
  }
</script>

<button onclick={increment}>
  count is {count}
</button>
