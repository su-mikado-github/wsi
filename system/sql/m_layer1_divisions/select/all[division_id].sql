select
  t.*
  , t1.sort_order as value_sort_order
  , t1.division_value_name
  , t1.description as value_description
  , t1.division_string_value
  , t1.division_text_value
  , t1.division_int_value
  , t1.division_double_value
  , t1.division_date_value
  , t1.division_datetime_value
  , t1.division_time_value
  , t1.division_flag_value
  , t1.delete_flag as value_delete_flag
  , t1.create_user as value_create_user
  , t1.create_ms as value_create_ms
  , t1.update_user as value_update_user
  , t1.update_ms as value_update_ms
from
  m_layer1_divisions t
  left outer join m_layer1_division_values t1 on (
    t1.division_id = t.division_id
    and t1.division_value_id = t.default_value_id
    <?php if (isset($binds['value_delete_flag'])) { ?>and t1.delete_flag = :value_delete_flag<?php } ?>
  )
where
  t.division_id = :division_id
  <?php if (isset($binds['delete_flag'])) { ?>and t.delete_flag = :delete_flag<?php } ?>
