<template>
  <div class="home">
    <MyHeader />
    <MyNav />
    <Category />
  </div>
</template>

<script>
// @ is an alias to /src
import MyHeader from '@/components/MyHeader';
import Category from '@/components/Category';
import MyNav from '@/components/MyNav';

export default {
  name: 'Home',
  components: {
    MyHeader,
    MyNav,
    Category,
  },
}
</script>


