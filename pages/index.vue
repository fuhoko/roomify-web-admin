<template>
  <div></div>
</template>
<script>
export default {
  middleware: [
    'AdminAuthRequired',
    ({ redirect }) => {
      return redirect('/users')
    }
  ]
}
</script>
