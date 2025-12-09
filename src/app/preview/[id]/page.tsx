"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { JobList } from './components/job-list'
import { PreviewContent } from './components/preview-content'
import { PreviewSummary } from './components/preview-summary'
import { Header } from '@/components/layout/header'
import { Search, Download, ArrowLeft, ChevronRight, ChevronLeft, FileText, ArrowLeftCircle, AlertCircle, FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import JSZip from 'jszip'
import { ErrorBoundary } from '@/components/error-boundary'

export interface PreviewJob {
  id: number
  job_name: string
  confidence_score: number
  confidence_level: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW'
  pattern_detected: string
  informatica_xml: string
  talend_xml: string
  transformations: any
  warnings: string[]
  created_at: string
  validation: {
    data_lineage: boolean
    business_rules: { passed: number; total: number }
    error_handling: boolean
    performance: boolean
  }
}

export interface PreviewStats {
  total_jobs: number
  jobs_with_preview: number
  avg_confidence: number
  high_confidence_count: number
  needs_review_count: number
  very_high_count: number
  high_count: number
  medium_count: number
  low_count: number
}

type FilterType = 'all' | 'very_high' | 'high' | 'medium' | 'low' | 'needs_review'

export default function PreviewPage() {
  const params = useParams()
  const router = useRouter()
  const migrationId = params.id as string

  const [jobs, setJobs] = useState<PreviewJob[]>([])
  const [stats, setStats] = useState<PreviewStats | null>(null)
  const [selectedJob, setSelectedJob] = useState<PreviewJob | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(true)
  const [isJobListCollapsed, setIsJobListCollapsed] = useState(false)
  const [usingMockData, setUsingMockData] = useState(false)

  // Fetch preview data with polling
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/preview/${migrationId}`)
        if (response.ok) {
          const data = await response.json()
          setJobs(data.jobs || [])
          setStats(data.stats || null)
          if (!selectedJob && data.jobs && data.jobs.length > 0) {
            setSelectedJob(data.jobs[0])
          }
        } else {
          // Use mock data when API is unavailable
          loadMockData()
        }
      } catch (error) {
        console.error('Failed to fetch preview:', error)
        // Use mock data when API is unavailable
        loadMockData()
      } finally {
        setLoading(false)
      }
    }

    const loadMockData = () => {
      const mockJobs: PreviewJob[] = [
        {
          id: 1,
          job_name: 'm_CustomerETL_SCD2',
          confidence_score: 98.5,
          confidence_level: 'VERY_HIGH',
          pattern_detected: 'SCD Type 2',
          informatica_xml: `<?xml version="1.0" encoding="UTF-8"?>
<POWERMART REPOSITORY_VERSION="187.0" CODEPAGE="UTF-8">
  <REPOSITORY NAME="PROD_REPO" VERSION="187" CODEPAGE="UTF-8" DATABASETYPE="Oracle">
    <FOLDER NAME="CustomerETL" GROUP="" OWNER="etl_admin" SHARED="NOTSHARED" DESCRIPTION="Customer dimension ETL processes" PERMISSIONS="rwxr-xr-x" UUID="FA234567-89AB-CDEF-0123-456789ABCDEF">
      <MAPPING NAME="m_CustomerETL_SCD2" DESCRIPTION="SCD Type 2 implementation for customer dimension tracking with history" ISVALID="YES" OBJECTVERSION="1" VERSIONNUMBER="2">
        <SOURCE NAME="SQ_CUSTOMER" SOURCETYPE="Source Qualifier" DBDNAME="SRC_CUSTOMER_TABLE" CONSTRAINT="" DESCRIPTION="Source qualifier for customer staging data">
          <SOURCEFIELD NAME="CUSTOMER_ID" DATATYPE="integer" FIELDNUMBER="1" PRECISION="10" SCALE="0" NULLABLE="NOTNULL" KEYTYPE="PRIMARY KEY"/>
          <SOURCEFIELD NAME="CUSTOMER_NAME" DATATYPE="varchar" FIELDNUMBER="2" PRECISION="100" SCALE="0" NULLABLE="NOTNULL"/>
          <SOURCEFIELD NAME="EMAIL" DATATYPE="varchar" FIELDNUMBER="3" PRECISION="100" SCALE="0" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="PHONE" DATATYPE="varchar" FIELDNUMBER="4" PRECISION="20" SCALE="0" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="ADDRESS" DATATYPE="varchar" FIELDNUMBER="5" PRECISION="200" SCALE="0" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="CITY" DATATYPE="varchar" FIELDNUMBER="6" PRECISION="50" SCALE="0" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="STATE" DATATYPE="varchar" FIELDNUMBER="7" PRECISION="50" SCALE="0" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="ZIP_CODE" DATATYPE="varchar" FIELDNUMBER="8" PRECISION="10" SCALE="0" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="COUNTRY" DATATYPE="varchar" FIELDNUMBER="9" PRECISION="50" SCALE="0" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="CREATED_DATE" DATATYPE="date" FIELDNUMBER="10" PRECISION="19" SCALE="0" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="LAST_MODIFIED_DATE" DATATYPE="date" FIELDNUMBER="11" PRECISION="19" SCALE="0" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="STATUS" DATATYPE="varchar" FIELDNUMBER="12" PRECISION="20" SCALE="0" NULLABLE="NULL"/>
        </SOURCE>
        <TRANSFORMATION NAME="EXP_ADD_AUDIT_COLUMNS" TYPE="Expression" DESCRIPTION="Add audit columns and calculate derived fields">
          <TRANSFORMFIELD NAME="CUSTOMER_ID" DATATYPE="integer" PRECISION="10" SCALE="0" EXPRESSION="CUSTOMER_ID" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="CUSTOMER_NAME" DATATYPE="varchar" PRECISION="100" SCALE="0" EXPRESSION="UPPER(TRIM(CUSTOMER_NAME))" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="EMAIL" DATATYPE="varchar" PRECISION="100" SCALE="0" EXPRESSION="LOWER(TRIM(EMAIL))" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="PHONE" DATATYPE="varchar" PRECISION="20" SCALE="0" EXPRESSION="PHONE" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="FULL_ADDRESS" DATATYPE="varchar" PRECISION="500" SCALE="0" EXPRESSION="ADDRESS || ', ' || CITY || ', ' || STATE || ' ' || ZIP_CODE" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="COUNTRY" DATATYPE="varchar" PRECISION="50" SCALE="0" EXPRESSION="COUNTRY" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="CREATED_DATE" DATATYPE="date" PRECISION="19" SCALE="0" EXPRESSION="CREATED_DATE" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="LAST_MODIFIED_DATE" DATATYPE="date" PRECISION="19" SCALE="0" EXPRESSION="LAST_MODIFIED_DATE" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="STATUS" DATATYPE="varchar" PRECISION="20" SCALE="0" EXPRESSION="STATUS" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="ETL_INSERT_DATE" DATATYPE="date" PRECISION="19" SCALE="0" EXPRESSION="SYSDATE" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="ETL_UPDATE_DATE" DATATYPE="date" PRECISION="19" SCALE="0" EXPRESSION="SYSDATE" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="RECORD_HASH" DATATYPE="varchar" PRECISION="32" SCALE="0" EXPRESSION="MD5(CUSTOMER_NAME || EMAIL || PHONE || FULL_ADDRESS)" EXPRESSIONTYPE="GENERAL"/>
        </TRANSFORMATION>
        <TRANSFORMATION NAME="LKP_DIM_CUSTOMER" TYPE="Lookup" DESCRIPTION="Lookup existing customer dimension records">
          <TRANSFORMFIELD NAME="DIM_CUSTOMER_SK" DATATYPE="integer" PRECISION="10" SCALE="0" PORTTYPE="OUTPUT"/>
          <TRANSFORMFIELD NAME="CUSTOMER_ID" DATATYPE="integer" PRECISION="10" SCALE="0" PORTTYPE="INPUT/OUTPUT"/>
          <TRANSFORMFIELD NAME="CURRENT_FLAG" DATATYPE="varchar" PRECISION="1" SCALE="0" PORTTYPE="OUTPUT"/>
          <TRANSFORMFIELD NAME="EFFECTIVE_DATE" DATATYPE="date" PRECISION="19" SCALE="0" PORTTYPE="OUTPUT"/>
          <TRANSFORMFIELD NAME="EXPIRATION_DATE" DATATYPE="date" PRECISION="19" SCALE="0" PORTTYPE="OUTPUT"/>
          <TRANSFORMFIELD NAME="RECORD_HASH_OLD" DATATYPE="varchar" PRECISION="32" SCALE="0" PORTTYPE="OUTPUT"/>
          <TABLEATTRIBUTE NAME="Lookup table name" VALUE="DIM_CUSTOMER"/>
          <TABLEATTRIBUTE NAME="Lookup condition" VALUE="CUSTOMER_ID = CUSTOMER_ID AND CURRENT_FLAG = 'Y'"/>
          <TABLEATTRIBUTE NAME="Connection type" VALUE="Connection"/>
          <TABLEATTRIBUTE NAME="Lookup cache" VALUE="Static"/>
        </TRANSFORMATION>
        <TRANSFORMATION NAME="EXP_DETECT_CHANGES" TYPE="Expression" DESCRIPTION="Detect type 1 and type 2 changes">
          <TRANSFORMFIELD NAME="CUSTOMER_ID" DATATYPE="integer" PRECISION="10" SCALE="0" EXPRESSION="CUSTOMER_ID" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="DIM_CUSTOMER_SK" DATATYPE="integer" PRECISION="10" SCALE="0" EXPRESSION="DIM_CUSTOMER_SK" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="IS_NEW_RECORD" DATATYPE="integer" PRECISION="1" SCALE="0" EXPRESSION="IIF(ISNULL(DIM_CUSTOMER_SK), 1, 0)" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="IS_CHANGED" DATATYPE="integer" PRECISION="1" SCALE="0" EXPRESSION="IIF(RECORD_HASH != RECORD_HASH_OLD, 1, 0)" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="CHANGE_TYPE" DATATYPE="varchar" PRECISION="10" SCALE="0" EXPRESSION="IIF(IS_NEW_RECORD = 1, 'INSERT', IIF(IS_CHANGED = 1, 'UPDATE', 'NO_CHANGE'))" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="NEW_EFFECTIVE_DATE" DATATYPE="date" PRECISION="19" SCALE="0" EXPRESSION="SYSDATE" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="NEW_EXPIRATION_DATE" DATATYPE="date" PRECISION="19" SCALE="0" EXPRESSION="TO_DATE('9999-12-31', 'YYYY-MM-DD')" EXPRESSIONTYPE="GENERAL"/>
        </TRANSFORMATION>
        <TRANSFORMATION NAME="RTR_ROUTE_CHANGES" TYPE="Router" DESCRIPTION="Route records based on change type">
          <GROUP NAME="NEW_RECORDS" FILTERCONDITION="CHANGE_TYPE = 'INSERT'" ORDER="1"/>
          <GROUP NAME="CHANGED_RECORDS" FILTERCONDITION="CHANGE_TYPE = 'UPDATE'" ORDER="2"/>
          <GROUP NAME="NO_CHANGE" FILTERCONDITION="CHANGE_TYPE = 'NO_CHANGE'" ORDER="3" DEFAULT="YES"/>
        </TRANSFORMATION>
        <TRANSFORMATION NAME="UPD_EXPIRE_OLD_RECORDS" TYPE="Update Strategy" DESCRIPTION="Mark old records as expired">
          <TRANSFORMFIELD NAME="DIM_CUSTOMER_SK" DATATYPE="integer" PRECISION="10" SCALE="0"/>
          <TRANSFORMFIELD NAME="CURRENT_FLAG" DATATYPE="varchar" PRECISION="1" SCALE="0" EXPRESSION="'N'" EXPRESSIONTYPE="GENERAL"/>
          <TRANSFORMFIELD NAME="EXPIRATION_DATE" DATATYPE="date" PRECISION="19" SCALE="0" EXPRESSION="SYSDATE" EXPRESSIONTYPE="GENERAL"/>
          <STRATEGY VALUE="DD_UPDATE" DESCRIPTION="Data driven update"/>
        </TRANSFORMATION>
        <TARGET NAME="TGT_DIM_CUSTOMER_INSERTS" DATABASETYPE="Oracle" TABLENAME="DIM_CUSTOMER" DESCRIPTION="Insert new customer dimension records">
          <TARGETFIELD NAME="DIM_CUSTOMER_SK" DATATYPE="integer" PRECISION="10" SCALE="0" NULLABLE="NOTNULL" KEYTYPE="PRIMARY KEY"/>
          <TARGETFIELD NAME="CUSTOMER_ID" DATATYPE="integer" PRECISION="10" SCALE="0" NULLABLE="NOTNULL"/>
          <TARGETFIELD NAME="CUSTOMER_NAME" DATATYPE="varchar" PRECISION="100" SCALE="0"/>
          <TARGETFIELD NAME="EMAIL" DATATYPE="varchar" PRECISION="100" SCALE="0"/>
          <TARGETFIELD NAME="PHONE" DATATYPE="varchar" PRECISION="20" SCALE="0"/>
          <TARGETFIELD NAME="FULL_ADDRESS" DATATYPE="varchar" PRECISION="500" SCALE="0"/>
          <TARGETFIELD NAME="COUNTRY" DATATYPE="varchar" PRECISION="50" SCALE="0"/>
          <TARGETFIELD NAME="STATUS" DATATYPE="varchar" PRECISION="20" SCALE="0"/>
          <TARGETFIELD NAME="EFFECTIVE_DATE" DATATYPE="date" PRECISION="19" SCALE="0"/>
          <TARGETFIELD NAME="EXPIRATION_DATE" DATATYPE="date" PRECISION="19" SCALE="0"/>
          <TARGETFIELD NAME="CURRENT_FLAG" DATATYPE="varchar" PRECISION="1" SCALE="0"/>
          <TARGETFIELD NAME="RECORD_HASH" DATATYPE="varchar" PRECISION="32" SCALE="0"/>
          <TARGETFIELD NAME="ETL_INSERT_DATE" DATATYPE="date" PRECISION="19" SCALE="0"/>
          <TARGETFIELD NAME="ETL_UPDATE_DATE" DATATYPE="date" PRECISION="19" SCALE="0"/>
        </TARGET>
        <TARGET NAME="TGT_DIM_CUSTOMER_UPDATES" DATABASETYPE="Oracle" TABLENAME="DIM_CUSTOMER" DESCRIPTION="Update expired customer dimension records">
          <TARGETFIELD NAME="DIM_CUSTOMER_SK" DATATYPE="integer" PRECISION="10" SCALE="0" NULLABLE="NOTNULL" KEYTYPE="PRIMARY KEY"/>
          <TARGETFIELD NAME="CURRENT_FLAG" DATATYPE="varchar" PRECISION="1" SCALE="0"/>
          <TARGETFIELD NAME="EXPIRATION_DATE" DATATYPE="date" PRECISION="19" SCALE="0"/>
          <TARGETFIELD NAME="ETL_UPDATE_DATE" DATATYPE="date" PRECISION="19" SCALE="0"/>
        </TARGET>
        <CONNECTOR FROMINSTANCE="SQ_CUSTOMER" FROMINSTANCETYPE="Source Qualifier" TOINSTANCE="EXP_ADD_AUDIT_COLUMNS" TOINSTANCETYPE="Expression"/>
        <CONNECTOR FROMINSTANCE="EXP_ADD_AUDIT_COLUMNS" FROMINSTANCETYPE="Expression" TOINSTANCE="LKP_DIM_CUSTOMER" TOINSTANCETYPE="Lookup"/>
        <CONNECTOR FROMINSTANCE="LKP_DIM_CUSTOMER" FROMINSTANCETYPE="Lookup" TOINSTANCE="EXP_DETECT_CHANGES" TOINSTANCETYPE="Expression"/>
        <CONNECTOR FROMINSTANCE="EXP_DETECT_CHANGES" FROMINSTANCETYPE="Expression" TOINSTANCE="RTR_ROUTE_CHANGES" TOINSTANCETYPE="Router"/>
        <CONNECTOR FROMINSTANCE="RTR_ROUTE_CHANGES" FROMINSTANCETYPE="Router" FROMGROUP="NEW_RECORDS" TOINSTANCE="TGT_DIM_CUSTOMER_INSERTS" TOINSTANCETYPE="Target"/>
        <CONNECTOR FROMINSTANCE="RTR_ROUTE_CHANGES" FROMINSTANCETYPE="Router" FROMGROUP="CHANGED_RECORDS" TOINSTANCE="UPD_EXPIRE_OLD_RECORDS" TOINSTANCETYPE="Update Strategy"/>
        <CONNECTOR FROMINSTANCE="UPD_EXPIRE_OLD_RECORDS" FROMINSTANCETYPE="Update Strategy" TOINSTANCE="TGT_DIM_CUSTOMER_UPDATES" TOINSTANCETYPE="Target"/>
      </MAPPING>
    </FOLDER>
  </REPOSITORY>
</POWERMART>`,
          talend_xml: `<?xml version="1.0" encoding="UTF-8"?>
<talendfile:ProcessType xmi:version="2.0"
  xmlns:xmi="http://www.omg.org/XMI"
  xmlns:talendfile="platform:/resource/org.talend.model/model/TalendFile.xsd"
  xmlns:TalendMapper="http://www.talend.org/mapper"
  defaultContext="Default"
  jobType="Standard">
  <context confirmationNeeded="false" name="Default">
    <contextParameter comment="" name="source_host" prompt="Source DB Host?" promptNeeded="false" type="id_String" value="localhost"/>
    <contextParameter comment="" name="source_port" prompt="Source DB Port?" promptNeeded="false" type="id_String" value="1521"/>
    <contextParameter comment="" name="source_database" prompt="Source Database?" promptNeeded="false" type="id_String" value="PROD"/>
    <contextParameter comment="" name="source_username" prompt="Source Username?" promptNeeded="false" type="id_String" value="etl_user"/>
    <contextParameter comment="" name="source_password" prompt="Source Password?" promptNeeded="false" type="id_Password" value="enc:system.encryption.key.v1"/>
  </context>
  <parameters>
    <elementParameter field="TEXT" name="SCREEN_OFFSET_X" show="false" value="0"/>
    <elementParameter field="TEXT" name="SCREEN_OFFSET_Y" show="false" value="0"/>
    <elementParameter field="TEXT" name="REPOSITORY_CONNECTION_ID" show="false" value=""/>
    <elementParameter field="TEXT" name="OOZIE_PROPERTY_TYPENAME" show="false" value=""/>
    <elementParameter field="TEXT" name="OOZIE_HADOOP_DISTRIBUTION" show="false" value=""/>
    <elementParameter field="TEXT" name="OOZIE_HADOOP_VERSION" show="false" value=""/>
    <elementParameter field="TEXT" name="OOZIE_ENABLE_KERBEROS" show="false" value=""/>
    <elementParameter field="TEXT" name="OOZIE_NAME_NODE_PRINCIPAL" show="false" value=""/>
    <elementParameter field="TEXT" name="OOZIE_USERNAME" show="false" value=""/>
    <elementParameter field="TEXT" name="OOZIE_GROUP" show="false" value=""/>
    <elementParameter field="TEXT" name="OOZIE_USE_KEYTAB" show="false" value=""/>
    <elementParameter field="TEXT" name="OOZIE_KT_PRINCIPAL" show="false" value=""/>
    <elementParameter field="TEXT" name="OOZIE_KEY_TAB" show="false" value=""/>
    <elementParameter field="TEXT" name="OOZIE_ENABLE_OO_SCHEMA" show="false" value=""/>
  </parameters>
  <node componentName="tOracleInput" componentVersion="0.102.0" offsetLabelX="0" offsetLabelY="0" posX="96" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" show="false" value="tOracleInput_1"/>
    <elementParameter field="TECHNICAL" name="PROPERTY:PROPERTY_TYPE" value="REPOSITORY"/>
    <elementParameter field="TECHNICAL" name="PROPERTY:REPOSITORY_PROPERTY_TYPE" show="false" value="_eKBj4HhqEe6G7dqFje948A"/>
    <elementParameter field="TEXT" name="HOST" value="context.source_host"/>
    <elementParameter field="TEXT" name="PORT" value="context.source_port"/>
    <elementParameter field="TEXT" name="DBNAME" value="context.source_database"/>
    <elementParameter field="TEXT" name="TYPE" show="false" value="Oracle"/>
    <elementParameter field="TEXT" name="USER" value="context.source_username"/>
    <elementParameter field="PASSWORD" name="PASS" value="enc:system.encryption.key.v1:context.source_password"/>
    <elementParameter field="DBTABLE" name="TABLE" value="&quot;SRC_CUSTOMER_TABLE&quot;"/>
    <elementParameter field="QUERYSTORE_TYPE" name="QUERYSTORE" value="&quot;&quot;"/>
    <elementParameter field="TECHNICAL" name="QUERYSTORE:REPOSITORY_QUERYSTORE_TYPE" show="false" value=""/>
    <elementParameter field="TECHNICAL" name="QUERYSTORE:QUERYSTORE_TYPE" value="BUILT_IN"/>
    <elementParameter field="GUESS_SCHEMA" name="GUESS_SCHEMA" value="&quot;&quot;"/>
    <elementParameter field="MEMO_SQL" name="QUERY" value="&quot;SELECT CUSTOMER_ID, CUSTOMER_NAME, EMAIL, PHONE, ADDRESS, CITY, STATE, ZIP_CODE, COUNTRY, CREATED_DATE, LAST_MODIFIED_DATE, STATUS FROM SRC_CUSTOMER_TABLE WHERE LAST_MODIFIED_DATE &gt; '&quot; + TalendDate.formatDate(&quot;yyyy-MM-dd&quot;, TalendDate.addDate(TalendDate.getCurrentDate(), -1, &quot;dd&quot;)) + &quot;'&quot;"/>
    <elementParameter field="LABEL" name="NOTE" value="Source: Customer Staging Table"/>
    <metadata connector="FLOW" name="tOracleInput_1">
      <column comment="" key="false" length="10" name="CUSTOMER_ID" nullable="false" pattern="" precision="0" sourceType="NUMBER" type="id_Integer" usefulColumn="true"/>
      <column comment="" key="false" length="100" name="CUSTOMER_NAME" nullable="false" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="100" name="EMAIL" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="20" name="PHONE" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="200" name="ADDRESS" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="50" name="CITY" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="50" name="STATE" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="10" name="ZIP_CODE" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="50" name="COUNTRY" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="19" name="CREATED_DATE" nullable="true" pattern="&quot;yyyy-MM-dd HH:mm:ss&quot;" precision="0" sourceType="DATE" type="id_Date" usefulColumn="true"/>
      <column comment="" key="false" length="19" name="LAST_MODIFIED_DATE" nullable="true" pattern="&quot;yyyy-MM-dd HH:mm:ss&quot;" precision="0" sourceType="DATE" type="id_Date" usefulColumn="true"/>
      <column comment="" key="false" length="20" name="STATUS" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
    </metadata>
  </node>
  <node componentName="tMap" componentVersion="2.1" offsetLabelX="0" offsetLabelY="0" posX="320" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" show="false" value="tMap_1"/>
    <elementParameter field="EXTERNAL" name="MAP" value=""/>
    <elementParameter field="CHECK" name="DIE_ON_ERROR" show="false" value="true"/>
    <elementParameter field="CHECK" name="LKUP_PARALLELIZE" show="false" value="false"/>
    <elementParameter field="TEXT" name="LEVENSHTEIN" show="false" value="0"/>
    <elementParameter field="TEXT" name="JACCARD" show="false" value="0"/>
    <elementParameter field="CHECK" name="ENABLE_AUTO_CONVERT_TYPE" show="false" value="false"/>
    <elementParameter field="TEXT" name="ROWS_BUFFER_SIZE" value="2000000"/>
    <elementParameter field="CHECK" name="CHANGE_HASH_AND_EQUALS_FOR_BIGDECIMAL" value="true"/>
    <elementParameter field="TEXT" name="LABEL" value="Add Audit Columns &amp; Lookup"/>
    <elementParameter field="TEXT" name="CONNECTION_FORMAT" value="row"/>
    <metadata connector="FLOW" name="out_new_records">
      <column comment="" key="false" length="10" name="CUSTOMER_ID" nullable="false" pattern="" precision="0" sourceType="" type="id_Integer" usefulColumn="true"/>
      <column comment="" key="false" length="100" name="CUSTOMER_NAME" nullable="true" pattern="" precision="0" sourceType="" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="100" name="EMAIL" nullable="true" pattern="" precision="0" sourceType="" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="20" name="PHONE" nullable="true" pattern="" precision="0" sourceType="" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="500" name="FULL_ADDRESS" nullable="true" pattern="" precision="0" sourceType="" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="50" name="COUNTRY" nullable="true" pattern="" precision="0" sourceType="" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="20" name="STATUS" nullable="true" pattern="" precision="0" sourceType="" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="19" name="EFFECTIVE_DATE" nullable="true" pattern="&quot;yyyy-MM-dd HH:mm:ss&quot;" precision="0" sourceType="" type="id_Date" usefulColumn="true"/>
      <column comment="" key="false" length="19" name="EXPIRATION_DATE" nullable="true" pattern="&quot;yyyy-MM-dd HH:mm:ss&quot;" precision="0" sourceType="" type="id_Date" usefulColumn="true"/>
      <column comment="" key="false" length="1" name="CURRENT_FLAG" nullable="true" pattern="" precision="0" sourceType="" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="32" name="RECORD_HASH" nullable="true" pattern="" precision="0" sourceType="" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="19" name="ETL_INSERT_DATE" nullable="true" pattern="&quot;yyyy-MM-dd HH:mm:ss&quot;" precision="0" sourceType="" type="id_Date" usefulColumn="true"/>
      <column comment="" key="false" length="19" name="ETL_UPDATE_DATE" nullable="true" pattern="&quot;yyyy-MM-dd HH:mm:ss&quot;" precision="0" sourceType="" type="id_Date" usefulColumn="true"/>
    </metadata>
    <metadata connector="FLOW" name="out_expire_records">
      <column comment="" key="false" length="10" name="DIM_CUSTOMER_SK" nullable="false" pattern="" precision="0" sourceType="" type="id_Integer" usefulColumn="true"/>
      <column comment="" key="false" length="1" name="CURRENT_FLAG" nullable="true" pattern="" precision="0" sourceType="" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="19" name="EXPIRATION_DATE" nullable="true" pattern="&quot;yyyy-MM-dd HH:mm:ss&quot;" precision="0" sourceType="" type="id_Date" usefulColumn="true"/>
      <column comment="" key="false" length="19" name="ETL_UPDATE_DATE" nullable="true" pattern="&quot;yyyy-MM-dd HH:mm:ss&quot;" precision="0" sourceType="" type="id_Date" usefulColumn="true"/>
    </metadata>
    <nodeData xsi:type="TalendMapper:MapperData">
      <uiProperties/>
      <varTables sizeState="INTERMEDIATE" name="Var"/>
      <outputTables sizeState="INTERMEDIATE" name="out_new_records">
        <mapperTableEntries expression="row1.CUSTOMER_ID" name="CUSTOMER_ID" nullable="false" type="id_Integer"/>
        <mapperTableEntries expression="StringHandling.UPPERTRIM(row1.CUSTOMER_NAME)" name="CUSTOMER_NAME" type="id_String"/>
        <mapperTableEntries expression="StringHandling.DOWNCASE(StringHandling.TRIM(row1.EMAIL))" name="EMAIL" type="id_String"/>
        <mapperTableEntries expression="row1.PHONE" name="PHONE" type="id_String"/>
        <mapperTableEntries expression="row1.ADDRESS + &quot;, &quot; + row1.CITY + &quot;, &quot; + row1.STATE + &quot; &quot; + row1.ZIP_CODE" name="FULL_ADDRESS" type="id_String"/>
        <mapperTableEntries expression="row1.COUNTRY" name="COUNTRY" type="id_String"/>
        <mapperTableEntries expression="row1.STATUS" name="STATUS" type="id_String"/>
        <mapperTableEntries expression="TalendDate.getCurrentDate()" name="EFFECTIVE_DATE" type="id_Date"/>
        <mapperTableEntries expression="TalendDate.parseDate(&quot;yyyy-MM-dd&quot;, &quot;9999-12-31&quot;)" name="EXPIRATION_DATE" type="id_Date"/>
        <mapperTableEntries expression="&quot;Y&quot;" name="CURRENT_FLAG" type="id_String"/>
        <mapperTableEntries expression="Numeric.sequence(&quot;s_dim_customer&quot;, 1, 1)" name="DIM_CUSTOMER_SK" type="id_Integer"/>
        <mapperTableEntries expression="TalendDate.getCurrentDate()" name="ETL_INSERT_DATE" type="id_Date"/>
        <mapperTableEntries expression="TalendDate.getCurrentDate()" name="ETL_UPDATE_DATE" type="id_Date"/>
      </outputTables>
      <outputTables sizeState="INTERMEDIATE" name="out_expire_records">
        <mapperTableEntries expression="lkp_dim_customer.DIM_CUSTOMER_SK" name="DIM_CUSTOMER_SK" type="id_Integer"/>
        <mapperTableEntries expression="&quot;N&quot;" name="CURRENT_FLAG" type="id_String"/>
        <mapperTableEntries expression="TalendDate.getCurrentDate()" name="EXPIRATION_DATE" type="id_Date"/>
        <mapperTableEntries expression="TalendDate.getCurrentDate()" name="ETL_UPDATE_DATE" type="id_Date"/>
      </outputTables>
    </nodeData>
  </node>
  <node componentName="tOracleOutput" componentVersion="0.102.0" offsetLabelX="0" offsetLabelY="0" posX="544" posY="96">
    <elementParameter field="TEXT" name="UNIQUE_NAME" show="false" value="tOracleOutput_1"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;DIM_CUSTOMER&quot;"/>
    <elementParameter field="CHECK" name="USE_EXISTING_CONNECTION" value="false"/>
    <elementParameter field="COMPONENT_LIST" name="CONNECTION" show="false" value=""/>
    <elementParameter field="CLOSED_LIST" name="TABLE_ACTION" value="NONE"/>
    <elementParameter field="CLOSED_LIST" name="DATA_ACTION" value="INSERT"/>
    <elementParameter field="CHECK" name="DIE_ON_ERROR" value="false"/>
    <elementParameter field="MAPPING_TYPE" name="MAPPING" show="false" value="oracle_id"/>
    <elementParameter field="TEXT" name="COMMIT_EVERY" value="10000"/>
    <elementParameter field="TEXT" name="LABEL" value="Insert New Records"/>
    <metadata connector="FLOW" name="tOracleOutput_1"/>
  </node>
  <node componentName="tOracleOutput" componentVersion="0.102.0" offsetLabelX="0" offsetLabelY="0" posX="544" posY="192">
    <elementParameter field="TEXT" name="UNIQUE_NAME" show="false" value="tOracleOutput_2"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;DIM_CUSTOMER&quot;"/>
    <elementParameter field="CHECK" name="USE_EXISTING_CONNECTION" value="false"/>
    <elementParameter field="COMPONENT_LIST" name="CONNECTION" show="false" value=""/>
    <elementParameter field="CLOSED_LIST" name="TABLE_ACTION" value="NONE"/>
    <elementParameter field="CLOSED_LIST" name="DATA_ACTION" value="UPDATE"/>
    <elementParameter field="TEXT" name="UPDATE_KEY" value="&quot;DIM_CUSTOMER_SK&quot;"/>
    <elementParameter field="CHECK" name="DIE_ON_ERROR" value="false"/>
    <elementParameter field="MAPPING_TYPE" name="MAPPING" show="false" value="oracle_id"/>
    <elementParameter field="TEXT" name="COMMIT_EVERY" value="10000"/>
    <elementParameter field="TEXT" name="LABEL" value="Expire Old Records"/>
    <metadata connector="FLOW" name="tOracleOutput_2"/>
  </node>
  <connection connectorName="FLOW" label="row1" lineStyle="0" metaname="tOracleInput_1" offsetLabelX="0" offsetLabelY="0" source="tOracleInput_1" target="tMap_1">
    <elementParameter field="CHECK" name="MONITOR_CONNECTION" value="false"/>
    <elementParameter field="TEXT" name="UNIQUE_NAME" show="false" value="row1"/>
  </connection>
  <connection connectorName="FLOW" label="out_new_records" lineStyle="0" metaname="out_new_records" offsetLabelX="0" offsetLabelY="0" outputId="1" source="tMap_1" target="tOracleOutput_1">
    <elementParameter field="CHECK" name="MONITOR_CONNECTION" value="false"/>
    <elementParameter field="TEXT" name="UNIQUE_NAME" show="false" value="out_new_records"/>
  </connection>
  <connection connectorName="FLOW" label="out_expire_records" lineStyle="0" metaname="out_expire_records" offsetLabelX="0" offsetLabelY="0" outputId="2" source="tMap_1" target="tOracleOutput_2">
    <elementParameter field="CHECK" name="MONITOR_CONNECTION" value="false"/>
    <elementParameter field="TEXT" name="UNIQUE_NAME" show="false" value="out_expire_records"/>
  </connection>
  <subjob>
    <elementParameter field="TEXT" name="UNIQUE_NAME" show="false" value="tOracleInput_1"/>
    <elementParameter field="COLOR" name="SUBJOB_TITLE_COLOR" show="false" value="92;131;150"/>
    <elementParameter field="COLOR" name="SUBJOB_COLOR" value="207;226;236"/>
  </subjob>
</talendfile:ProcessType>`,
          transformations: {
            'EXP_ADD_AUDIT_COLUMNS': 'tMap with derived columns',
            'LKP_DIM_CUSTOMER': 'tMap lookup table',
            'EXP_DETECT_CHANGES': 'tMap change detection',
            'RTR_ROUTE_CHANGES': 'tMap filter outputs',
            'UPD_EXPIRE_OLD_RECORDS': 'tMap with update flag'
          },
          warnings: ['Lookup cache size may need tuning for large datasets'],
          created_at: '2024-11-28T10:30:00.000Z',
          validation: {
            data_lineage: true,
            business_rules: { passed: 5, total: 5 },
            error_handling: true,
            performance: true
          }
        },
        {
          id: 2,
          job_name: 'm_ProductHierarchy_Aggregation',
          confidence_score: 96.2,
          confidence_level: 'VERY_HIGH',
          pattern_detected: 'Aggregation',
          informatica_xml: `<?xml version="1.0" encoding="UTF-8"?>
<POWERMART REPOSITORY_VERSION="187.0" CODEPAGE="UTF-8">
  <REPOSITORY NAME="PROD_REPO" VERSION="187" CODEPAGE="UTF-8" DATABASETYPE="Oracle">
    <FOLDER NAME="ProductETL" GROUP="" OWNER="etl_admin" SHARED="NOTSHARED" DESCRIPTION="Product hierarchy and aggregation" PERMISSIONS="rwxr-xr-x">
      <MAPPING NAME="m_ProductHierarchy_Aggregation" DESCRIPTION="Product sales aggregation by category and region" ISVALID="YES">
        <SOURCE NAME="SQ_SALES_DETAIL" SOURCETYPE="Source Qualifier" DBDNAME="SALES_DETAIL">
          <SOURCEFIELD NAME="SALE_ID" DATATYPE="integer" PRECISION="10" NULLABLE="NOTNULL"/>
          <SOURCEFIELD NAME="PRODUCT_ID" DATATYPE="integer" PRECISION="10" NULLABLE="NOTNULL"/>
          <SOURCEFIELD NAME="PRODUCT_NAME" DATATYPE="varchar" PRECISION="200" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="CATEGORY" DATATYPE="varchar" PRECISION="50" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="SUB_CATEGORY" DATATYPE="varchar" PRECISION="50" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="REGION" DATATYPE="varchar" PRECISION="50" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="SALE_DATE" DATATYPE="date" PRECISION="19" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="QUANTITY" DATATYPE="integer" PRECISION="10" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="UNIT_PRICE" DATATYPE="decimal" PRECISION="10" SCALE="2" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="DISCOUNT_PERCENT" DATATYPE="decimal" PRECISION="5" SCALE="2" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="TAX_AMOUNT" DATATYPE="decimal" PRECISION="10" SCALE="2" NULLABLE="NULL"/>
          <SOURCEFIELD NAME="TOTAL_AMOUNT" DATATYPE="decimal" PRECISION="15" SCALE="2" NULLABLE="NULL"/>
        </SOURCE>
        <TRANSFORMATION NAME="EXP_CALCULATE_METRICS" TYPE="Expression" DESCRIPTION="Calculate derived sales metrics">
          <TRANSFORMFIELD NAME="SALE_ID" DATATYPE="integer" EXPRESSION="SALE_ID"/>
          <TRANSFORMFIELD NAME="PRODUCT_ID" DATATYPE="integer" EXPRESSION="PRODUCT_ID"/>
          <TRANSFORMFIELD NAME="PRODUCT_NAME" DATATYPE="varchar" PRECISION="200" EXPRESSION="PRODUCT_NAME"/>
          <TRANSFORMFIELD NAME="CATEGORY" DATATYPE="varchar" PRECISION="50" EXPRESSION="CATEGORY"/>
          <TRANSFORMFIELD NAME="SUB_CATEGORY" DATATYPE="varchar" PRECISION="50" EXPRESSION="SUB_CATEGORY"/>
          <TRANSFORMFIELD NAME="REGION" DATATYPE="varchar" PRECISION="50" EXPRESSION="REGION"/>
          <TRANSFORMFIELD NAME="SALE_DATE" DATATYPE="date" EXPRESSION="SALE_DATE"/>
          <TRANSFORMFIELD NAME="SALE_YEAR" DATATYPE="integer" EXPRESSION="TO_NUMBER(TO_CHAR(SALE_DATE, 'YYYY'))"/>
          <TRANSFORMFIELD NAME="SALE_MONTH" DATATYPE="integer" EXPRESSION="TO_NUMBER(TO_CHAR(SALE_DATE, 'MM'))"/>
          <TRANSFORMFIELD NAME="SALE_QUARTER" DATATYPE="integer" EXPRESSION="TO_NUMBER(TO_CHAR(SALE_DATE, 'Q'))"/>
          <TRANSFORMFIELD NAME="QUANTITY" DATATYPE="integer" EXPRESSION="QUANTITY"/>
          <TRANSFORMFIELD NAME="UNIT_PRICE" DATATYPE="decimal" PRECISION="10" SCALE="2" EXPRESSION="UNIT_PRICE"/>
          <TRANSFORMFIELD NAME="GROSS_AMOUNT" DATATYPE="decimal" PRECISION="15" SCALE="2" EXPRESSION="QUANTITY * UNIT_PRICE"/>
          <TRANSFORMFIELD NAME="DISCOUNT_PERCENT" DATATYPE="decimal" PRECISION="5" SCALE="2" EXPRESSION="DISCOUNT_PERCENT"/>
          <TRANSFORMFIELD NAME="DISCOUNT_AMOUNT" DATATYPE="decimal" PRECISION="15" SCALE="2" EXPRESSION="(QUANTITY * UNIT_PRICE) * (DISCOUNT_PERCENT / 100)"/>
          <TRANSFORMFIELD NAME="TAX_AMOUNT" DATATYPE="decimal" PRECISION="10" SCALE="2" EXPRESSION="TAX_AMOUNT"/>
          <TRANSFORMFIELD NAME="NET_AMOUNT" DATATYPE="decimal" PRECISION="15" SCALE="2" EXPRESSION="TOTAL_AMOUNT - DISCOUNT_AMOUNT"/>
          <TRANSFORMFIELD NAME="TOTAL_AMOUNT" DATATYPE="decimal" PRECISION="15" SCALE="2" EXPRESSION="TOTAL_AMOUNT"/>
          <TRANSFORMFIELD NAME="PROFIT_MARGIN" DATATYPE="decimal" PRECISION="5" SCALE="2" EXPRESSION="((NET_AMOUNT - (UNIT_PRICE * 0.6)) / NET_AMOUNT) * 100"/>
        </TRANSFORMATION>
        <TRANSFORMATION NAME="AGG_PRODUCT_CATEGORY_SALES" TYPE="Aggregator" DESCRIPTION="Aggregate sales by product category and region">
          <TRANSFORMFIELD NAME="CATEGORY" DATATYPE="varchar" PRECISION="50" PORTTYPE="INPUT/OUTPUT" GROUPBY="YES"/>
          <TRANSFORMFIELD NAME="SUB_CATEGORY" DATATYPE="varchar" PRECISION="50" PORTTYPE="INPUT/OUTPUT" GROUPBY="YES"/>
          <TRANSFORMFIELD NAME="REGION" DATATYPE="varchar" PRECISION="50" PORTTYPE="INPUT/OUTPUT" GROUPBY="YES"/>
          <TRANSFORMFIELD NAME="SALE_YEAR" DATATYPE="integer" PORTTYPE="INPUT/OUTPUT" GROUPBY="YES"/>
          <TRANSFORMFIELD NAME="SALE_QUARTER" DATATYPE="integer" PORTTYPE="INPUT/OUTPUT" GROUPBY="YES"/>
          <TRANSFORMFIELD NAME="TOTAL_SALES" DATATYPE="decimal" PRECISION="18" SCALE="2" PORTTYPE="OUTPUT" EXPRESSION="SUM(TOTAL_AMOUNT)"/>
          <TRANSFORMFIELD NAME="TOTAL_QUANTITY" DATATYPE="integer" PORTTYPE="OUTPUT" EXPRESSION="SUM(QUANTITY)"/>
          <TRANSFORMFIELD NAME="TOTAL_DISCOUNT" DATATYPE="decimal" PRECISION="18" SCALE="2" PORTTYPE="OUTPUT" EXPRESSION="SUM(DISCOUNT_AMOUNT)"/>
          <TRANSFORMFIELD NAME="TOTAL_TAX" DATATYPE="decimal" PRECISION="18" SCALE="2" PORTTYPE="OUTPUT" EXPRESSION="SUM(TAX_AMOUNT)"/>
          <TRANSFORMFIELD NAME="NET_SALES" DATATYPE="decimal" PRECISION="18" SCALE="2" PORTTYPE="OUTPUT" EXPRESSION="SUM(NET_AMOUNT)"/>
          <TRANSFORMFIELD NAME="AVG_UNIT_PRICE" DATATYPE="decimal" PRECISION="10" SCALE="2" PORTTYPE="OUTPUT" EXPRESSION="AVG(UNIT_PRICE)"/>
          <TRANSFORMFIELD NAME="AVG_PROFIT_MARGIN" DATATYPE="decimal" PRECISION="5" SCALE="2" PORTTYPE="OUTPUT" EXPRESSION="AVG(PROFIT_MARGIN)"/>
          <TRANSFORMFIELD NAME="MIN_SALE_DATE" DATATYPE="date" PORTTYPE="OUTPUT" EXPRESSION="MIN(SALE_DATE)"/>
          <TRANSFORMFIELD NAME="MAX_SALE_DATE" DATATYPE="date" PORTTYPE="OUTPUT" EXPRESSION="MAX(SALE_DATE)"/>
          <TRANSFORMFIELD NAME="TRANSACTION_COUNT" DATATYPE="integer" PORTTYPE="OUTPUT" EXPRESSION="COUNT(*)"/>
          <TABLEATTRIBUTE NAME="Sorted Input" VALUE="FALSE"/>
          <TABLEATTRIBUTE NAME="Cache Directory" VALUE="$PMCacheDir"/>
        </TRANSFORMATION>
        <TRANSFORMATION NAME="EXP_ADD_AGGREGATE_METRICS" TYPE="Expression" DESCRIPTION="Add performance metrics">
          <TRANSFORMFIELD NAME="CATEGORY" DATATYPE="varchar" PRECISION="50" EXPRESSION="CATEGORY"/>
          <TRANSFORMFIELD NAME="SUB_CATEGORY" DATATYPE="varchar" PRECISION="50" EXPRESSION="SUB_CATEGORY"/>
          <TRANSFORMFIELD NAME="REGION" DATATYPE="varchar" PRECISION="50" EXPRESSION="REGION"/>
          <TRANSFORMFIELD NAME="SALE_YEAR" DATATYPE="integer" EXPRESSION="SALE_YEAR"/>
          <TRANSFORMFIELD NAME="SALE_QUARTER" DATATYPE="integer" EXPRESSION="SALE_QUARTER"/>
          <TRANSFORMFIELD NAME="TOTAL_SALES" DATATYPE="decimal" PRECISION="18" SCALE="2" EXPRESSION="TOTAL_SALES"/>
          <TRANSFORMFIELD NAME="TOTAL_QUANTITY" DATATYPE="integer" EXPRESSION="TOTAL_QUANTITY"/>
          <TRANSFORMFIELD NAME="NET_SALES" DATATYPE="decimal" PRECISION="18" SCALE="2" EXPRESSION="NET_SALES"/>
          <TRANSFORMFIELD NAME="AVG_TRANSACTION_VALUE" DATATYPE="decimal" PRECISION="15" SCALE="2" EXPRESSION="TOTAL_SALES / TRANSACTION_COUNT"/>
          <TRANSFORMFIELD NAME="DISCOUNT_RATE" DATATYPE="decimal" PRECISION="5" SCALE="2" EXPRESSION="(TOTAL_DISCOUNT / TOTAL_SALES) * 100"/>
          <TRANSFORMFIELD NAME="TRANSACTION_COUNT" DATATYPE="integer" EXPRESSION="TRANSACTION_COUNT"/>
          <TRANSFORMFIELD NAME="ETL_LOAD_DATE" DATATYPE="date" EXPRESSION="SYSDATE"/>
          <TRANSFORMFIELD NAME="DATA_QUALITY_FLAG" DATATYPE="varchar" PRECISION="1" EXPRESSION="IIF(TOTAL_SALES > 0 AND TRANSACTION_COUNT > 0, 'V', 'E')"/>
        </TRANSFORMATION>
        <TRANSFORMATION NAME="FIL_VALID_AGGREGATES" TYPE="Filter" DESCRIPTION="Filter invalid aggregates">
          <TRANSFORMFIELD NAME="FILTER_CONDITION" EXPRESSION="DATA_QUALITY_FLAG = 'V' AND TOTAL_SALES > 0"/>
        </TRANSFORMATION>
        <TARGET NAME="TGT_PRODUCT_SALES_SUMMARY" DATABASETYPE="Oracle" TABLENAME="PRODUCT_SALES_SUMMARY">
          <TARGETFIELD NAME="CATEGORY" DATATYPE="varchar" PRECISION="50" NULLABLE="NOTNULL"/>
          <TARGETFIELD NAME="SUB_CATEGORY" DATATYPE="varchar" PRECISION="50" NULLABLE="NOTNULL"/>
          <TARGETFIELD NAME="REGION" DATATYPE="varchar" PRECISION="50" NULLABLE="NOTNULL"/>
          <TARGETFIELD NAME="SALE_YEAR" DATATYPE="integer" NULLABLE="NOTNULL"/>
          <TARGETFIELD NAME="SALE_QUARTER" DATATYPE="integer" NULLABLE="NOTNULL"/>
          <TARGETFIELD NAME="TOTAL_SALES" DATATYPE="decimal" PRECISION="18" SCALE="2"/>
          <TARGETFIELD NAME="TOTAL_QUANTITY" DATATYPE="integer"/>
          <TARGETFIELD NAME="NET_SALES" DATATYPE="decimal" PRECISION="18" SCALE="2"/>
          <TARGETFIELD NAME="AVG_TRANSACTION_VALUE" DATATYPE="decimal" PRECISION="15" SCALE="2"/>
          <TARGETFIELD NAME="DISCOUNT_RATE" DATATYPE="decimal" PRECISION="5" SCALE="2"/>
          <TARGETFIELD NAME="TRANSACTION_COUNT" DATATYPE="integer"/>
          <TARGETFIELD NAME="ETL_LOAD_DATE" DATATYPE="date"/>
        </TARGET>
        <CONNECTOR FROMINSTANCE="SQ_SALES_DETAIL" TOINSTANCE="EXP_CALCULATE_METRICS"/>
        <CONNECTOR FROMINSTANCE="EXP_CALCULATE_METRICS" TOINSTANCE="AGG_PRODUCT_CATEGORY_SALES"/>
        <CONNECTOR FROMINSTANCE="AGG_PRODUCT_CATEGORY_SALES" TOINSTANCE="EXP_ADD_AGGREGATE_METRICS"/>
        <CONNECTOR FROMINSTANCE="EXP_ADD_AGGREGATE_METRICS" TOINSTANCE="FIL_VALID_AGGREGATES"/>
        <CONNECTOR FROMINSTANCE="FIL_VALID_AGGREGATES" TOINSTANCE="TGT_PRODUCT_SALES_SUMMARY"/>
      </MAPPING>
    </FOLDER>
  </REPOSITORY>
</POWERMART>`,
          talend_xml: `<?xml version="1.0" encoding="UTF-8"?>
<talendfile:ProcessType xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:talendfile="platform:/resource/org.talend.model/model/TalendFile.xsd" defaultContext="Default" jobType="Standard">
  <parameters>
    <elementParameter field="TEXT" name="SCREEN_OFFSET_X" value="0"/>
    <elementParameter field="TEXT" name="SCREEN_OFFSET_Y" value="0"/>
  </parameters>
  <node componentName="tOracleInput" componentVersion="0.102.0" posX="96" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tOracleInput_SalesDetail"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;SALES_DETAIL&quot;"/>
    <elementParameter field="MEMO_SQL" name="QUERY" value="&quot;SELECT SALE_ID, PRODUCT_ID, PRODUCT_NAME, CATEGORY, SUB_CATEGORY, REGION, SALE_DATE, QUANTITY, UNIT_PRICE, DISCOUNT_PERCENT, TAX_AMOUNT, TOTAL_AMOUNT FROM SALES_DETAIL&quot;"/>
    <metadata connector="FLOW" name="tOracleInput_SalesDetail">
      <column name="SALE_ID" type="id_Integer" length="10"/>
      <column name="PRODUCT_ID" type="id_Integer" length="10"/>
      <column name="PRODUCT_NAME" type="id_String" length="200"/>
      <column name="CATEGORY" type="id_String" length="50"/>
      <column name="SUB_CATEGORY" type="id_String" length="50"/>
      <column name="REGION" type="id_String" length="50"/>
      <column name="SALE_DATE" type="id_Date" pattern="&quot;yyyy-MM-dd HH:mm:ss&quot;"/>
      <column name="QUANTITY" type="id_Integer" length="10"/>
      <column name="UNIT_PRICE" type="id_BigDecimal" precision="10" scale="2"/>
      <column name="DISCOUNT_PERCENT" type="id_BigDecimal" precision="5" scale="2"/>
      <column name="TAX_AMOUNT" type="id_BigDecimal" precision="10" scale="2"/>
      <column name="TOTAL_AMOUNT" type="id_BigDecimal" precision="15" scale="2"/>
    </metadata>
  </node>
  <node componentName="tMap" componentVersion="2.1" posX="320" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tMap_CalculateMetrics"/>
    <elementParameter field="TEXT" name="LABEL" value="Calculate Sales Metrics"/>
    <metadata connector="FLOW" name="sales_with_metrics">
      <column name="SALE_ID" type="id_Integer"/>
      <column name="CATEGORY" type="id_String" length="50"/>
      <column name="SUB_CATEGORY" type="id_String" length="50"/>
      <column name="REGION" type="id_String" length="50"/>
      <column name="SALE_DATE" type="id_Date"/>
      <column name="SALE_YEAR" type="id_Integer"/>
      <column name="SALE_QUARTER" type="id_Integer"/>
      <column name="QUANTITY" type="id_Integer"/>
      <column name="UNIT_PRICE" type="id_BigDecimal" precision="10" scale="2"/>
      <column name="GROSS_AMOUNT" type="id_BigDecimal" precision="15" scale="2"/>
      <column name="DISCOUNT_AMOUNT" type="id_BigDecimal" precision="15" scale="2"/>
      <column name="TAX_AMOUNT" type="id_BigDecimal" precision="10" scale="2"/>
      <column name="NET_AMOUNT" type="id_BigDecimal" precision="15" scale="2"/>
      <column name="TOTAL_AMOUNT" type="id_BigDecimal" precision="15" scale="2"/>
      <column name="PROFIT_MARGIN" type="id_BigDecimal" precision="5" scale="2"/>
    </metadata>
    <nodeData xsi:type="TalendMapper:MapperData">
      <outputTables name="sales_with_metrics">
        <mapperTableEntries expression="row1.CATEGORY" name="CATEGORY"/>
        <mapperTableEntries expression="row1.SUB_CATEGORY" name="SUB_CATEGORY"/>
        <mapperTableEntries expression="row1.REGION" name="REGION"/>
        <mapperTableEntries expression="TalendDate.getYear(row1.SALE_DATE)" name="SALE_YEAR"/>
        <mapperTableEntries expression="((TalendDate.getMonth(row1.SALE_DATE) - 1) / 3) + 1" name="SALE_QUARTER"/>
        <mapperTableEntries expression="row1.QUANTITY" name="QUANTITY"/>
        <mapperTableEntries expression="row1.UNIT_PRICE" name="UNIT_PRICE"/>
        <mapperTableEntries expression="row1.QUANTITY * row1.UNIT_PRICE" name="GROSS_AMOUNT"/>
        <mapperTableEntries expression="(row1.QUANTITY * row1.UNIT_PRICE) * (row1.DISCOUNT_PERCENT / 100)" name="DISCOUNT_AMOUNT"/>
        <mapperTableEntries expression="row1.TOTAL_AMOUNT - ((row1.QUANTITY * row1.UNIT_PRICE) * (row1.DISCOUNT_PERCENT / 100))" name="NET_AMOUNT"/>
      </outputTables>
    </nodeData>
  </node>
  <node componentName="tAggregateRow" componentVersion="2.1" posX="544" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tAggregateRow_ProductSales"/>
    <elementParameter field="TEXT" name="LABEL" value="Aggregate by Category/Region/Period"/>
    <elementParameter field="TABLE" name="GROUPBYS">
      <elementValue elementRef="INPUT_COLUMN" value="CATEGORY"/>
      <elementValue elementRef="OUTPUT_COLUMN" value="CATEGORY"/>
      <elementValue elementRef="INPUT_COLUMN" value="SUB_CATEGORY"/>
      <elementValue elementRef="OUTPUT_COLUMN" value="SUB_CATEGORY"/>
      <elementValue elementRef="INPUT_COLUMN" value="REGION"/>
      <elementValue elementRef="OUTPUT_COLUMN" value="REGION"/>
      <elementValue elementRef="INPUT_COLUMN" value="SALE_YEAR"/>
      <elementValue elementRef="OUTPUT_COLUMN" value="SALE_YEAR"/>
      <elementValue elementRef="INPUT_COLUMN" value="SALE_QUARTER"/>
      <elementValue elementRef="OUTPUT_COLUMN" value="SALE_QUARTER"/>
    </elementParameter>
    <elementParameter field="TABLE" name="OPERATIONS">
      <elementValue elementRef="INPUT_COLUMN" value="TOTAL_AMOUNT"/>
      <elementValue elementRef="FUNCTION" value="sum"/>
      <elementValue elementRef="OUTPUT_COLUMN" value="TOTAL_SALES"/>
      <elementValue elementRef="INPUT_COLUMN" value="QUANTITY"/>
      <elementValue elementRef="FUNCTION" value="sum"/>
      <elementValue elementRef="OUTPUT_COLUMN" value="TOTAL_QUANTITY"/>
      <elementValue elementRef="INPUT_COLUMN" value="DISCOUNT_AMOUNT"/>
      <elementValue elementRef="FUNCTION" value="sum"/>
      <elementValue elementRef="OUTPUT_COLUMN" value="TOTAL_DISCOUNT"/>
      <elementValue elementRef="INPUT_COLUMN" value="NET_AMOUNT"/>
      <elementValue elementRef="FUNCTION" value="sum"/>
      <elementValue elementRef="OUTPUT_COLUMN" value="NET_SALES"/>
      <elementValue elementRef="INPUT_COLUMN" value="UNIT_PRICE"/>
      <elementValue elementRef="FUNCTION" value="avg"/>
      <elementValue elementRef="OUTPUT_COLUMN" value="AVG_UNIT_PRICE"/>
      <elementValue elementRef="INPUT_COLUMN" value="SALE_ID"/>
      <elementValue elementRef="FUNCTION" value="count"/>
      <elementValue elementRef="OUTPUT_COLUMN" value="TRANSACTION_COUNT"/>
    </elementParameter>
    <metadata connector="FLOW" name="aggregated_sales">
      <column name="CATEGORY" type="id_String" length="50"/>
      <column name="SUB_CATEGORY" type="id_String" length="50"/>
      <column name="REGION" type="id_String" length="50"/>
      <column name="SALE_YEAR" type="id_Integer"/>
      <column name="SALE_QUARTER" type="id_Integer"/>
      <column name="TOTAL_SALES" type="id_BigDecimal" precision="18" scale="2"/>
      <column name="TOTAL_QUANTITY" type="id_Integer"/>
      <column name="TOTAL_DISCOUNT" type="id_BigDecimal" precision="18" scale="2"/>
      <column name="NET_SALES" type="id_BigDecimal" precision="18" scale="2"/>
      <column name="AVG_UNIT_PRICE" type="id_BigDecimal" precision="10" scale="2"/>
      <column name="TRANSACTION_COUNT" type="id_Integer"/>
    </metadata>
  </node>
  <node componentName="tMap" componentVersion="2.1" posX="768" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tMap_FinalMetrics"/>
    <elementParameter field="TEXT" name="LABEL" value="Add Final Metrics"/>
    <metadata connector="FLOW" name="final_output">
      <column name="CATEGORY" type="id_String" length="50"/>
      <column name="SUB_CATEGORY" type="id_String" length="50"/>
      <column name="REGION" type="id_String" length="50"/>
      <column name="SALE_YEAR" type="id_Integer"/>
      <column name="SALE_QUARTER" type="id_Integer"/>
      <column name="TOTAL_SALES" type="id_BigDecimal" precision="18" scale="2"/>
      <column name="TOTAL_QUANTITY" type="id_Integer"/>
      <column name="NET_SALES" type="id_BigDecimal" precision="18" scale="2"/>
      <column name="AVG_TRANSACTION_VALUE" type="id_BigDecimal" precision="15" scale="2"/>
      <column name="DISCOUNT_RATE" type="id_BigDecimal" precision="5" scale="2"/>
      <column name="TRANSACTION_COUNT" type="id_Integer"/>
      <column name="ETL_LOAD_DATE" type="id_Date"/>
      <column name="DATA_QUALITY_FLAG" type="id_String" length="1"/>
    </metadata>
    <nodeData xsi:type="TalendMapper:MapperData">
      <outputTables name="final_output">
        <mapperTableEntries expression="agg.TOTAL_SALES / agg.TRANSACTION_COUNT" name="AVG_TRANSACTION_VALUE"/>
        <mapperTableEntries expression="(agg.TOTAL_DISCOUNT / agg.TOTAL_SALES) * 100" name="DISCOUNT_RATE"/>
        <mapperTableEntries expression="TalendDate.getCurrentDate()" name="ETL_LOAD_DATE"/>
        <mapperTableEntries expression="agg.TOTAL_SALES &gt; 0 &amp;&amp; agg.TRANSACTION_COUNT &gt; 0 ? &quot;V&quot; : &quot;E&quot;" name="DATA_QUALITY_FLAG"/>
      </outputTables>
    </nodeData>
  </node>
  <node componentName="tFilterRow" componentVersion="3.1" posX="992" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tFilterRow_ValidAggregates"/>
    <elementParameter field="TABLE" name="CONDITIONS">
      <elementValue elementRef="INPUT_COLUMN" value="DATA_QUALITY_FLAG"/>
      <elementValue elementRef="FUNCTION" value="=="/>
      <elementValue elementRef="VALUE" value="&quot;V&quot;"/>
      <elementValue elementRef="OPERATOR" value="&amp;&amp;"/>
      <elementValue elementRef="INPUT_COLUMN" value="TOTAL_SALES"/>
      <elementValue elementRef="FUNCTION" value="&gt;"/>
      <elementValue elementRef="VALUE" value="0"/>
    </elementParameter>
  </node>
  <node componentName="tOracleOutput" componentVersion="0.102.0" posX="1216" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tOracleOutput_Summary"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;PRODUCT_SALES_SUMMARY&quot;"/>
    <elementParameter field="CLOSED_LIST" name="DATA_ACTION" value="INSERT_OR_UPDATE"/>
    <elementParameter field="TEXT" name="COMMIT_EVERY" value="10000"/>
    <metadata connector="FLOW" name="tOracleOutput_Summary"/>
  </node>
  <connection connectorName="FLOW" label="row1" source="tOracleInput_SalesDetail" target="tMap_CalculateMetrics"/>
  <connection connectorName="FLOW" label="sales_with_metrics" source="tMap_CalculateMetrics" target="tAggregateRow_ProductSales"/>
  <connection connectorName="FLOW" label="aggregated" source="tAggregateRow_ProductSales" target="tMap_FinalMetrics"/>
  <connection connectorName="FLOW" label="with_metrics" source="tMap_FinalMetrics" target="tFilterRow_ValidAggregates"/>
  <connection connectorName="FLOW" label="valid_aggregates" source="tFilterRow_ValidAggregates" target="tOracleOutput_Summary"/>
</talendfile:ProcessType>`,
          transformations: {
            'EXP_CALCULATE_METRICS': 'tMap calculated fields',
            'AGG_PRODUCT_CATEGORY_SALES': 'tAggregateRow with group by',
            'EXP_ADD_AGGREGATE_METRICS': 'tMap derived metrics',
            'FIL_VALID_AGGREGATES': 'tFilterRow quality check'
          },
          warnings: [],
          created_at: '2024-11-28T10:30:00.000Z',
          validation: { data_lineage: true, business_rules: { passed: 5, total: 5 }, error_handling: true, performance: true }
        },
        {
          id: 3,
          job_name: 'm_OrderValidation_Filter',
          confidence_score: 91.8,
          confidence_level: 'VERY_HIGH',
          pattern_detected: 'Filter & Route',
          informatica_xml: `<?xml version="1.0" encoding="UTF-8"?>
<POWERMART REPOSITORY_VERSION="187.0">
  <REPOSITORY NAME="PROD_REPO">
    <FOLDER NAME="OrderETL">
      <MAPPING NAME="m_OrderValidation_Filter" DESCRIPTION="Order validation and routing logic">
        <SOURCE NAME="SQ_ORDERS" SOURCETYPE="Source Qualifier">
          <SOURCEFIELD NAME="ORDER_ID" DATATYPE="integer" PRECISION="10"/>
          <SOURCEFIELD NAME="CUSTOMER_ID" DATATYPE="integer" PRECISION="10"/>
          <SOURCEFIELD NAME="ORDER_DATE" DATATYPE="date" PRECISION="19"/>
          <SOURCEFIELD NAME="ORDER_STATUS" DATATYPE="varchar" PRECISION="20"/>
          <SOURCEFIELD NAME="TOTAL_AMOUNT" DATATYPE="decimal" PRECISION="15" SCALE="2"/>
          <SOURCEFIELD NAME="PAYMENT_METHOD" DATATYPE="varchar" PRECISION="30"/>
          <SOURCEFIELD NAME="SHIPPING_ADDRESS" DATATYPE="varchar" PRECISION="300"/>
        </SOURCE>
        <TRANSFORMATION NAME="EXP_VALIDATION_RULES" TYPE="Expression">
          <TRANSFORMFIELD NAME="ORDER_ID" EXPRESSION="ORDER_ID"/>
          <TRANSFORMFIELD NAME="IS_VALID_AMOUNT" EXPRESSION="IIF(TOTAL_AMOUNT > 0 AND TOTAL_AMOUNT < 999999, 1, 0)"/>
          <TRANSFORMFIELD NAME="IS_VALID_STATUS" EXPRESSION="IIF(ORDER_STATUS IN ('PENDING','CONFIRMED','SHIPPED'), 1, 0)"/>
          <TRANSFORMFIELD NAME="IS_VALID_CUSTOMER" EXPRESSION="IIF(NOT ISNULL(CUSTOMER_ID) AND CUSTOMER_ID > 0, 1, 0)"/>
          <TRANSFORMFIELD NAME="VALIDATION_FLAG" EXPRESSION="IIF(IS_VALID_AMOUNT = 1 AND IS_VALID_STATUS = 1 AND IS_VALID_CUSTOMER = 1, 'VALID', 'INVALID')"/>
        </TRANSFORMATION>
        <TRANSFORMATION NAME="RTR_ORDER_ROUTING" TYPE="Router">
          <GROUP NAME="VALID_ORDERS" FILTERCONDITION="VALIDATION_FLAG = 'VALID'"/>
          <GROUP NAME="INVALID_ORDERS" FILTERCONDITION="VALIDATION_FLAG = 'INVALID'" DEFAULT="YES"/>
        </TRANSFORMATION>
        <TARGET NAME="TGT_VALID_ORDERS" TABLENAME="VALID_ORDERS"/>
        <TARGET NAME="TGT_INVALID_ORDERS" TABLENAME="INVALID_ORDERS"/>
      </MAPPING>
    </FOLDER>
  </REPOSITORY>
</POWERMART>`,
          talend_xml: `<?xml version="1.0" encoding="UTF-8"?>
<talendfile:ProcessType xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:talendfile="platform:/resource/org.talend.model/model/TalendFile.xsd" defaultContext="Default" jobType="Standard">
  <parameters>
    <elementParameter field="TEXT" name="SCREEN_OFFSET_X" value="0"/>
    <elementParameter field="TEXT" name="SCREEN_OFFSET_Y" value="0"/>
  </parameters>
  <node componentName="tOracleInput" componentVersion="0.102.0" posX="96" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tOracleInput_Orders"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;ORDERS&quot;"/>
    <elementParameter field="MEMO_SQL" name="QUERY" value="&quot;SELECT ORDER_ID, CUSTOMER_ID, ORDER_DATE, ORDER_STATUS, TOTAL_AMOUNT, PAYMENT_METHOD, SHIPPING_ADDRESS FROM ORDERS&quot;"/>
    <elementParameter field="TEXT" name="LABEL" value="Source: Orders Table"/>
    <metadata connector="FLOW" name="tOracleInput_Orders">
      <column comment="" key="false" length="10" name="ORDER_ID" nullable="false" pattern="" precision="0" sourceType="NUMBER" type="id_Integer" usefulColumn="true"/>
      <column comment="" key="false" length="10" name="CUSTOMER_ID" nullable="false" pattern="" precision="0" sourceType="NUMBER" type="id_Integer" usefulColumn="true"/>
      <column comment="" key="false" length="19" name="ORDER_DATE" nullable="true" pattern="&quot;yyyy-MM-dd HH:mm:ss&quot;" precision="0" sourceType="DATE" type="id_Date" usefulColumn="true"/>
      <column comment="" key="false" length="20" name="ORDER_STATUS" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="15" name="TOTAL_AMOUNT" nullable="true" pattern="" precision="15" scale="2" sourceType="NUMBER" type="id_BigDecimal" usefulColumn="true"/>
      <column comment="" key="false" length="30" name="PAYMENT_METHOD" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="300" name="SHIPPING_ADDRESS" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
    </metadata>
  </node>
  <node componentName="tMap" componentVersion="2.1" posX="320" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tMap_ValidationRules"/>
    <elementParameter field="TEXT" name="LABEL" value="Order Validation Rules"/>
    <metadata connector="FLOW" name="validated_orders">
      <column name="ORDER_ID" type="id_Integer"/>
      <column name="CUSTOMER_ID" type="id_Integer"/>
      <column name="ORDER_DATE" type="id_Date"/>
      <column name="ORDER_STATUS" type="id_String" length="20"/>
      <column name="TOTAL_AMOUNT" type="id_BigDecimal" precision="15" scale="2"/>
      <column name="PAYMENT_METHOD" type="id_String" length="30"/>
      <column name="SHIPPING_ADDRESS" type="id_String" length="300"/>
      <column name="IS_VALID_AMOUNT" type="id_Integer"/>
      <column name="IS_VALID_STATUS" type="id_Integer"/>
      <column name="IS_VALID_CUSTOMER" type="id_Integer"/>
      <column name="VALIDATION_FLAG" type="id_String" length="10"/>
    </metadata>
    <nodeData xsi:type="TalendMapper:MapperData">
      <outputTables name="validated_orders">
        <mapperTableEntries expression="row1.ORDER_ID" name="ORDER_ID"/>
        <mapperTableEntries expression="row1.CUSTOMER_ID" name="CUSTOMER_ID"/>
        <mapperTableEntries expression="row1.ORDER_DATE" name="ORDER_DATE"/>
        <mapperTableEntries expression="row1.ORDER_STATUS" name="ORDER_STATUS"/>
        <mapperTableEntries expression="row1.TOTAL_AMOUNT" name="TOTAL_AMOUNT"/>
        <mapperTableEntries expression="row1.PAYMENT_METHOD" name="PAYMENT_METHOD"/>
        <mapperTableEntries expression="row1.SHIPPING_ADDRESS" name="SHIPPING_ADDRESS"/>
        <mapperTableEntries expression="(row1.TOTAL_AMOUNT != null &amp;&amp; row1.TOTAL_AMOUNT.compareTo(new BigDecimal(0)) > 0 &amp;&amp; row1.TOTAL_AMOUNT.compareTo(new BigDecimal(999999)) < 0) ? 1 : 0" name="IS_VALID_AMOUNT"/>
        <mapperTableEntries expression="(&quot;PENDING&quot;.equals(row1.ORDER_STATUS) || &quot;CONFIRMED&quot;.equals(row1.ORDER_STATUS) || &quot;SHIPPED&quot;.equals(row1.ORDER_STATUS)) ? 1 : 0" name="IS_VALID_STATUS"/>
        <mapperTableEntries expression="(row1.CUSTOMER_ID != null &amp;&amp; row1.CUSTOMER_ID > 0) ? 1 : 0" name="IS_VALID_CUSTOMER"/>
        <mapperTableEntries expression="(Var.IS_VALID_AMOUNT == 1 &amp;&amp; Var.IS_VALID_STATUS == 1 &amp;&amp; Var.IS_VALID_CUSTOMER == 1) ? &quot;VALID&quot; : &quot;INVALID&quot;" name="VALIDATION_FLAG"/>
      </outputTables>
    </nodeData>
  </node>
  <node componentName="tFilterRow" componentVersion="1.1" posX="544" posY="96">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tFilterRow_ValidOrders"/>
    <elementParameter field="TABLE" name="CONDITIONS">
      <elementValue elementRef="INPUT_COLUMN" value="VALIDATION_FLAG"/>
      <elementValue elementRef="FUNCTION" value="=="/>
      <elementValue elementRef="VALUE" value="&quot;VALID&quot;"/>
    </elementParameter>
    <elementParameter field="TEXT" name="LABEL" value="Route Valid Orders"/>
    <metadata connector="FLOW" name="valid_orders_output"/>
  </node>
  <node componentName="tFilterRow" componentVersion="1.1" posX="544" posY="192">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tFilterRow_InvalidOrders"/>
    <elementParameter field="TABLE" name="CONDITIONS">
      <elementValue elementRef="INPUT_COLUMN" value="VALIDATION_FLAG"/>
      <elementValue elementRef="FUNCTION" value="=="/>
      <elementValue elementRef="VALUE" value="&quot;INVALID&quot;"/>
    </elementParameter>
    <elementParameter field="TEXT" name="LABEL" value="Route Invalid Orders"/>
    <metadata connector="FLOW" name="invalid_orders_output"/>
  </node>
  <node componentName="tOracleOutput" componentVersion="0.102.0" posX="768" posY="96">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tOracleOutput_ValidOrders"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;VALID_ORDERS&quot;"/>
    <elementParameter field="CLOSED_LIST" name="DATA_ACTION" value="INSERT"/>
    <elementParameter field="TEXT" name="LABEL" value="Target: Valid Orders"/>
    <metadata connector="FLOW" name="tOracleOutput_ValidOrders"/>
  </node>
  <node componentName="tOracleOutput" componentVersion="0.102.0" posX="768" posY="192">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tOracleOutput_InvalidOrders"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;INVALID_ORDERS&quot;"/>
    <elementParameter field="CLOSED_LIST" name="DATA_ACTION" value="INSERT"/>
    <elementParameter field="TEXT" name="LABEL" value="Target: Invalid Orders"/>
    <metadata connector="FLOW" name="tOracleOutput_InvalidOrders"/>
  </node>
  <connection connectorName="FLOW" label="row1" lineStyle="0" metaname="tOracleInput_Orders" source="tOracleInput_Orders" target="tMap_ValidationRules"/>
  <connection connectorName="FLOW" label="validated_orders" lineStyle="0" metaname="validated_orders" source="tMap_ValidationRules" target="tFilterRow_ValidOrders"/>
  <connection connectorName="FLOW" label="valid_orders_output" lineStyle="0" metaname="valid_orders_output" source="tFilterRow_ValidOrders" target="tOracleOutput_ValidOrders"/>
  <connection connectorName="REJECT" label="invalid_orders_output" lineStyle="0" metaname="invalid_orders_output" source="tFilterRow_ValidOrders" target="tFilterRow_InvalidOrders"/>
  <connection connectorName="FLOW" label="invalid_orders_output" lineStyle="0" metaname="invalid_orders_output" source="tFilterRow_InvalidOrders" target="tOracleOutput_InvalidOrders"/>
</talendfile:ProcessType>`,
          transformations: {
            'EXP_VALIDATION_RULES': 'tMap validation logic',
            'RTR_ORDER_ROUTING': 'tFilterRow routing'
          },
          warnings: ['Consider adding email notification for invalid orders', 'High-value orders (>$10000) should have additional approval step'],
          created_at: '2024-11-28T10:30:00.000Z',
          validation: { data_lineage: true, business_rules: { passed: 5, total: 5 }, error_handling: true, performance: true }
        },
        {
          id: 4,
          job_name: 'm_InventoryJoiner_DailySnapshot',
          confidence_score: 87.3,
          confidence_level: 'HIGH',
          pattern_detected: 'Joiner',
          informatica_xml: `<?xml version="1.0" encoding="UTF-8"?>
<POWERMART REPOSITORY_VERSION="187.0">
  <REPOSITORY NAME="PROD_REPO">
    <FOLDER NAME="InventoryETL">
      <MAPPING NAME="m_InventoryJoiner_DailySnapshot" DESCRIPTION="Join inventory with product master for daily snapshot">
        <SOURCE NAME="SQ_INVENTORY" SOURCETYPE="Source Qualifier">
          <SOURCEFIELD NAME="INVENTORY_ID" DATATYPE="integer"/>
          <SOURCEFIELD NAME="PRODUCT_ID" DATATYPE="integer"/>
          <SOURCEFIELD NAME="WAREHOUSE_ID" DATATYPE="integer"/>
          <SOURCEFIELD NAME="QUANTITY_ON_HAND" DATATYPE="integer"/>
          <SOURCEFIELD NAME="REORDER_LEVEL" DATATYPE="integer"/>
          <SOURCEFIELD NAME="LAST_UPDATED" DATATYPE="date"/>
        </SOURCE>
        <SOURCE NAME="SQ_PRODUCTS" SOURCETYPE="Source Qualifier">
          <SOURCEFIELD NAME="PRODUCT_ID" DATATYPE="integer"/>
          <SOURCEFIELD NAME="PRODUCT_NAME" DATATYPE="varchar" PRECISION="200"/>
          <SOURCEFIELD NAME="UNIT_COST" DATATYPE="decimal" PRECISION="10" SCALE="2"/>
        </SOURCE>
        <TRANSFORMATION NAME="JNR_INVENTORY_PRODUCT" TYPE="Joiner" DESCRIPTION="Inner join on PRODUCT_ID">
          <TABLEATTRIBUTE NAME="Join Type" VALUE="Normal Join"/>
          <TABLEATTRIBUTE NAME="Join Condition" VALUE="SQ_INVENTORY.PRODUCT_ID = SQ_PRODUCTS.PRODUCT_ID"/>
        </TRANSFORMATION>
        <TRANSFORMATION NAME="EXP_CALCULATE_VALUE" TYPE="Expression">
          <TRANSFORMFIELD NAME="INVENTORY_VALUE" EXPRESSION="QUANTITY_ON_HAND * UNIT_COST"/>
          <TRANSFORMFIELD NAME="REORDER_FLAG" EXPRESSION="IIF(QUANTITY_ON_HAND <= REORDER_LEVEL, 'Y', 'N')"/>
        </TRANSFORMATION>
        <TARGET NAME="TGT_INVENTORY_SNAPSHOT" TABLENAME="INVENTORY_SNAPSHOT"/>
      </MAPPING>
    </FOLDER>
  </REPOSITORY>
</POWERMART>`,
          talend_xml: `<?xml version="1.0" encoding="UTF-8"?>
<talendfile:ProcessType xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:talendfile="platform:/resource/org.talend.model/model/TalendFile.xsd" xmlns:TalendMapper="http://www.talend.org/mapper" defaultContext="Default" jobType="Standard">
  <parameters>
    <elementParameter field="TEXT" name="SCREEN_OFFSET_X" value="0"/>
    <elementParameter field="TEXT" name="SCREEN_OFFSET_Y" value="0"/>
  </parameters>
  <node componentName="tOracleInput" componentVersion="0.102.0" posX="96" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tOracleInput_Inventory"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;INVENTORY&quot;"/>
    <elementParameter field="MEMO_SQL" name="QUERY" value="&quot;SELECT INVENTORY_ID, PRODUCT_ID, WAREHOUSE_ID, QUANTITY_ON_HAND, REORDER_LEVEL, LAST_UPDATED FROM INVENTORY&quot;"/>
    <elementParameter field="TEXT" name="LABEL" value="Source: Inventory Table (Main)"/>
    <metadata connector="FLOW" name="tOracleInput_Inventory">
      <column comment="" key="false" length="10" name="INVENTORY_ID" nullable="false" pattern="" precision="0" sourceType="NUMBER" type="id_Integer" usefulColumn="true"/>
      <column comment="" key="false" length="10" name="PRODUCT_ID" nullable="false" pattern="" precision="0" sourceType="NUMBER" type="id_Integer" usefulColumn="true"/>
      <column comment="" key="false" length="10" name="WAREHOUSE_ID" nullable="false" pattern="" precision="0" sourceType="NUMBER" type="id_Integer" usefulColumn="true"/>
      <column comment="" key="false" length="10" name="QUANTITY_ON_HAND" nullable="true" pattern="" precision="0" sourceType="NUMBER" type="id_Integer" usefulColumn="true"/>
      <column comment="" key="false" length="10" name="REORDER_LEVEL" nullable="true" pattern="" precision="0" sourceType="NUMBER" type="id_Integer" usefulColumn="true"/>
      <column comment="" key="false" length="19" name="LAST_UPDATED" nullable="true" pattern="&quot;yyyy-MM-dd HH:mm:ss&quot;" precision="0" sourceType="DATE" type="id_Date" usefulColumn="true"/>
    </metadata>
  </node>
  <node componentName="tOracleInput" componentVersion="0.102.0" posX="96" posY="256">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tOracleInput_Products"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;PRODUCTS&quot;"/>
    <elementParameter field="MEMO_SQL" name="QUERY" value="&quot;SELECT PRODUCT_ID, PRODUCT_NAME, UNIT_COST FROM PRODUCTS&quot;"/>
    <elementParameter field="TEXT" name="LABEL" value="Source: Products Table (Lookup)"/>
    <metadata connector="FLOW" name="tOracleInput_Products">
      <column comment="" key="false" length="10" name="PRODUCT_ID" nullable="false" pattern="" precision="0" sourceType="NUMBER" type="id_Integer" usefulColumn="true"/>
      <column comment="" key="false" length="200" name="PRODUCT_NAME" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="10" name="UNIT_COST" nullable="true" pattern="" precision="10" scale="2" sourceType="NUMBER" type="id_BigDecimal" usefulColumn="true"/>
    </metadata>
  </node>
  <node componentName="tMap" componentVersion="2.1" posX="320" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tMap_JoinInventoryProduct"/>
    <elementParameter field="EXTERNAL" name="MAP" value=""/>
    <elementParameter field="CHECK" name="DIE_ON_ERROR" value="true"/>
    <elementParameter field="CHECK" name="LKUP_PARALLELIZE" value="false"/>
    <elementParameter field="TEXT" name="LOOKUP_MODEL_LOAD_ONCE" value="LOAD_ONCE"/>
    <elementParameter field="TEXT" name="LABEL" value="Join Inventory with Products (Inner Join on PRODUCT_ID)"/>
    <elementParameter field="TEXT" name="CONNECTION_FORMAT" value="row"/>
    <metadata connector="FLOW" name="inventory_enriched">
      <column name="INVENTORY_ID" type="id_Integer" length="10"/>
      <column name="PRODUCT_ID" type="id_Integer" length="10"/>
      <column name="WAREHOUSE_ID" type="id_Integer" length="10"/>
      <column name="QUANTITY_ON_HAND" type="id_Integer" length="10"/>
      <column name="REORDER_LEVEL" type="id_Integer" length="10"/>
      <column name="LAST_UPDATED" type="id_Date" pattern="&quot;yyyy-MM-dd HH:mm:ss&quot;"/>
      <column name="PRODUCT_NAME" type="id_String" length="200"/>
      <column name="UNIT_COST" type="id_BigDecimal" precision="10" scale="2"/>
      <column name="INVENTORY_VALUE" type="id_BigDecimal" precision="15" scale="2"/>
      <column name="REORDER_FLAG" type="id_String" length="1"/>
    </metadata>
    <nodeData xsi:type="TalendMapper:MapperData">
      <uiProperties/>
      <varTables sizeState="INTERMEDIATE" name="Var"/>
      <inputTables lookupMode="LOAD_ONCE" matchingMode="UNIQUE_MATCH" name="lkp_products">
        <mapperTableEntries name="PRODUCT_ID" expression="" type="id_Integer"/>
        <mapperTableEntries name="PRODUCT_NAME" expression="" type="id_String"/>
        <mapperTableEntries name="UNIT_COST" expression="" type="id_BigDecimal"/>
      </inputTables>
      <outputTables sizeState="INTERMEDIATE" name="inventory_enriched">
        <mapperTableEntries expression="row1.INVENTORY_ID" name="INVENTORY_ID" type="id_Integer"/>
        <mapperTableEntries expression="row1.PRODUCT_ID" name="PRODUCT_ID" type="id_Integer"/>
        <mapperTableEntries expression="row1.WAREHOUSE_ID" name="WAREHOUSE_ID" type="id_Integer"/>
        <mapperTableEntries expression="row1.QUANTITY_ON_HAND" name="QUANTITY_ON_HAND" type="id_Integer"/>
        <mapperTableEntries expression="row1.REORDER_LEVEL" name="REORDER_LEVEL" type="id_Integer"/>
        <mapperTableEntries expression="row1.LAST_UPDATED" name="LAST_UPDATED" type="id_Date"/>
        <mapperTableEntries expression="lkp_products.PRODUCT_NAME" name="PRODUCT_NAME" type="id_String"/>
        <mapperTableEntries expression="lkp_products.UNIT_COST" name="UNIT_COST" type="id_BigDecimal"/>
        <mapperTableEntries expression="row1.QUANTITY_ON_HAND * lkp_products.UNIT_COST" name="INVENTORY_VALUE" type="id_BigDecimal"/>
        <mapperTableEntries expression="row1.QUANTITY_ON_HAND &lt;= row1.REORDER_LEVEL ? &quot;Y&quot; : &quot;N&quot;" name="REORDER_FLAG" type="id_String"/>
      </outputTables>
    </nodeData>
  </node>
  <node componentName="tOracleOutput" componentVersion="0.102.0" posX="544" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tOracleOutput_Snapshot"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;INVENTORY_SNAPSHOT&quot;"/>
    <elementParameter field="CHECK" name="USE_EXISTING_CONNECTION" value="false"/>
    <elementParameter field="CLOSED_LIST" name="TABLE_ACTION" value="TRUNCATE"/>
    <elementParameter field="CLOSED_LIST" name="DATA_ACTION" value="INSERT"/>
    <elementParameter field="TEXT" name="COMMIT_EVERY" value="10000"/>
    <elementParameter field="TEXT" name="LABEL" value="Target: Inventory Snapshot (Daily)"/>
    <metadata connector="FLOW" name="tOracleOutput_Snapshot">
      <column name="INVENTORY_ID" type="id_Integer"/>
      <column name="PRODUCT_ID" type="id_Integer"/>
      <column name="WAREHOUSE_ID" type="id_Integer"/>
      <column name="QUANTITY_ON_HAND" type="id_Integer"/>
      <column name="REORDER_LEVEL" type="id_Integer"/>
      <column name="LAST_UPDATED" type="id_Date"/>
      <column name="PRODUCT_NAME" type="id_String" length="200"/>
      <column name="UNIT_COST" type="id_BigDecimal" precision="10" scale="2"/>
      <column name="INVENTORY_VALUE" type="id_BigDecimal" precision="15" scale="2"/>
      <column name="REORDER_FLAG" type="id_String" length="1"/>
    </metadata>
  </node>
  <connection connectorName="FLOW" label="row1" lineStyle="0" metaname="tOracleInput_Inventory" source="tOracleInput_Inventory" target="tMap_JoinInventoryProduct"/>
  <connection connectorName="FLOW" label="lkp_products" lineStyle="0" metaname="tOracleInput_Products" source="tOracleInput_Products" target="tMap_JoinInventoryProduct">
    <elementParameter field="TABLE" name="LOOKUP" value="PRODUCT_ID"/>
  </connection>
  <connection connectorName="FLOW" label="inventory_enriched" lineStyle="0" metaname="inventory_enriched" source="tMap_JoinInventoryProduct" target="tOracleOutput_Snapshot"/>
</talendfile:ProcessType>`,
          transformations: {
            'JNR_INVENTORY_PRODUCT': 'tMap inner join',
            'EXP_CALCULATE_VALUE': 'tMap calculations'
          },
          warnings: ['Large product master table - consider partitioning', 'Memory requirements for lookup may be high'],
          created_at: '2024-11-28T10:30:00.000Z',
          validation: { data_lineage: true, business_rules: { passed: 5, total: 5 }, error_handling: true, performance: true }
        },
        {
          id: 5,
          job_name: 'm_CustomerProfile_Union',
          confidence_score: 79.4,
          confidence_level: 'HIGH',
          pattern_detected: 'Union',
          informatica_xml: `<?xml version="1.0" encoding="UTF-8"?>
<POWERMART REPOSITORY_VERSION="187.0">
  <REPOSITORY NAME="PROD_REPO">
    <FOLDER NAME="CustomerETL">
      <MAPPING NAME="m_CustomerProfile_Union" DESCRIPTION="Union customer data from multiple sources">
        <SOURCE NAME="SQ_ONLINE_CUSTOMERS">
          <SOURCEFIELD NAME="CUSTOMER_ID" DATATYPE="varchar" PRECISION="50"/>
          <SOURCEFIELD NAME="FIRST_NAME" DATATYPE="varchar" PRECISION="100"/>
          <SOURCEFIELD NAME="LAST_NAME" DATATYPE="varchar" PRECISION="100"/>
          <SOURCEFIELD NAME="EMAIL" DATATYPE="varchar" PRECISION="100"/>
          <SOURCEFIELD NAME="SOURCE_SYSTEM" DATATYPE="varchar" PRECISION="20"/>
        </SOURCE>
        <SOURCE NAME="SQ_RETAIL_CUSTOMERS">
          <SOURCEFIELD NAME="CUSTOMER_ID" DATATYPE="varchar" PRECISION="50"/>
          <SOURCEFIELD NAME="FIRST_NAME" DATATYPE="varchar" PRECISION="100"/>
          <SOURCEFIELD NAME="LAST_NAME" DATATYPE="varchar" PRECISION="100"/>
          <SOURCEFIELD NAME="EMAIL" DATATYPE="varchar" PRECISION="100"/>
          <SOURCEFIELD NAME="SOURCE_SYSTEM" DATATYPE="varchar" PRECISION="20"/>
        </SOURCE>
        <TRANSFORMATION NAME="UNION_ALL_CUSTOMERS" TYPE="Union">
          <TABLEATTRIBUTE NAME="Union Type" VALUE="Union All"/>
        </TRANSFORMATION>
        <TRANSFORMATION NAME="EXP_STANDARDIZE" TYPE="Expression">
          <TRANSFORMFIELD NAME="CUSTOMER_ID" EXPRESSION="CUSTOMER_ID"/>
          <TRANSFORMFIELD NAME="FULL_NAME" EXPRESSION="FIRST_NAME || ' ' || LAST_NAME"/>
          <TRANSFORMFIELD NAME="EMAIL_LOWER" EXPRESSION="LOWER(TRIM(EMAIL))"/>
        </TRANSFORMATION>
        <TARGET NAME="TGT_UNIFIED_CUSTOMERS"/>
      </MAPPING>
    </FOLDER>
  </REPOSITORY>
</POWERMART>`,
          talend_xml: `<?xml version="1.0" encoding="UTF-8"?>
<talendfile:ProcessType xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:talendfile="platform:/resource/org.talend.model/model/TalendFile.xsd" xmlns:TalendMapper="http://www.talend.org/mapper" defaultContext="Default" jobType="Standard">
  <parameters>
    <elementParameter field="TEXT" name="SCREEN_OFFSET_X" value="0"/>
    <elementParameter field="TEXT" name="SCREEN_OFFSET_Y" value="0"/>
  </parameters>
  <node componentName="tOracleInput" componentVersion="0.102.0" posX="96" posY="96">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tOracleInput_OnlineCustomers"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;ONLINE_CUSTOMERS&quot;"/>
    <elementParameter field="MEMO_SQL" name="QUERY" value="&quot;SELECT CUSTOMER_ID, FIRST_NAME, LAST_NAME, EMAIL, SOURCE_SYSTEM FROM ONLINE_CUSTOMERS&quot;"/>
    <elementParameter field="TEXT" name="LABEL" value="Source: Online Customers"/>
    <metadata connector="FLOW" name="online_customers">
      <column comment="" key="false" length="50" name="CUSTOMER_ID" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="100" name="FIRST_NAME" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="100" name="LAST_NAME" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="100" name="EMAIL" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="20" name="SOURCE_SYSTEM" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
    </metadata>
  </node>
  <node componentName="tOracleInput" componentVersion="0.102.0" posX="96" posY="192">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tOracleInput_RetailCustomers"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;RETAIL_CUSTOMERS&quot;"/>
    <elementParameter field="MEMO_SQL" name="QUERY" value="&quot;SELECT CUSTOMER_ID, FIRST_NAME, LAST_NAME, EMAIL, SOURCE_SYSTEM FROM RETAIL_CUSTOMERS&quot;"/>
    <elementParameter field="TEXT" name="LABEL" value="Source: Retail Customers"/>
    <metadata connector="FLOW" name="retail_customers">
      <column comment="" key="false" length="50" name="CUSTOMER_ID" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="100" name="FIRST_NAME" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="100" name="LAST_NAME" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="100" name="EMAIL" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="20" name="SOURCE_SYSTEM" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
    </metadata>
  </node>
  <node componentName="tUnite" componentVersion="1.0" posX="320" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tUnite_AllCustomers"/>
    <elementParameter field="CHECK" name="KEEP_ORDER" value="false"/>
    <elementParameter field="TEXT" name="LABEL" value="Union All Customer Sources"/>
    <metadata connector="FLOW" name="united_customers">
      <column name="CUSTOMER_ID" type="id_String" length="50"/>
      <column name="FIRST_NAME" type="id_String" length="100"/>
      <column name="LAST_NAME" type="id_String" length="100"/>
      <column name="EMAIL" type="id_String" length="100"/>
      <column name="SOURCE_SYSTEM" type="id_String" length="20"/>
    </metadata>
  </node>
  <node componentName="tMap" componentVersion="2.1" posX="544" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tMap_Standardize"/>
    <elementParameter field="TEXT" name="LABEL" value="Standardize Customer Data"/>
    <metadata connector="FLOW" name="standardized_customers">
      <column name="CUSTOMER_ID" type="id_String" length="50"/>
      <column name="FIRST_NAME" type="id_String" length="100"/>
      <column name="LAST_NAME" type="id_String" length="100"/>
      <column name="FULL_NAME" type="id_String" length="201"/>
      <column name="EMAIL" type="id_String" length="100"/>
      <column name="EMAIL_LOWER" type="id_String" length="100"/>
      <column name="SOURCE_SYSTEM" type="id_String" length="20"/>
    </metadata>
    <nodeData xsi:type="TalendMapper:MapperData">
      <outputTables name="standardized_customers">
        <mapperTableEntries expression="row1.CUSTOMER_ID" name="CUSTOMER_ID"/>
        <mapperTableEntries expression="row1.FIRST_NAME" name="FIRST_NAME"/>
        <mapperTableEntries expression="row1.LAST_NAME" name="LAST_NAME"/>
        <mapperTableEntries expression="row1.FIRST_NAME + &quot; &quot; + row1.LAST_NAME" name="FULL_NAME"/>
        <mapperTableEntries expression="row1.EMAIL" name="EMAIL"/>
        <mapperTableEntries expression="StringHandling.DOWNCASE(StringHandling.TRIM(row1.EMAIL))" name="EMAIL_LOWER"/>
        <mapperTableEntries expression="row1.SOURCE_SYSTEM" name="SOURCE_SYSTEM"/>
      </outputTables>
    </nodeData>
  </node>
  <node componentName="tOracleOutput" componentVersion="0.102.0" posX="768" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tOracleOutput_Unified"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;UNIFIED_CUSTOMERS&quot;"/>
    <elementParameter field="CLOSED_LIST" name="DATA_ACTION" value="INSERT"/>
    <elementParameter field="TEXT" name="COMMIT_EVERY" value="10000"/>
    <elementParameter field="TEXT" name="LABEL" value="Target: Unified Customer Profile"/>
    <metadata connector="FLOW" name="tOracleOutput_Unified"/>
  </node>
  <connection connectorName="FLOW" label="online_customers" lineStyle="0" metaname="online_customers" source="tOracleInput_OnlineCustomers" target="tUnite_AllCustomers"/>
  <connection connectorName="FLOW" label="retail_customers" lineStyle="0" metaname="retail_customers" source="tOracleInput_RetailCustomers" target="tUnite_AllCustomers"/>
  <connection connectorName="FLOW" label="united_customers" lineStyle="0" metaname="united_customers" source="tUnite_AllCustomers" target="tMap_Standardize"/>
  <connection connectorName="FLOW" label="standardized_customers" lineStyle="0" metaname="standardized_customers" source="tMap_Standardize" target="tOracleOutput_Unified"/>
</talendfile:ProcessType>`,
          transformations: {
            'UNION_ALL_CUSTOMERS': 'tUnite',
            'EXP_STANDARDIZE': 'tMap standardization'
          },
          warnings: ['Duplicate customer records possible across sources', 'Need deduplication logic after union'],
          created_at: '2024-11-28T10:30:00.000Z',
          validation: { data_lineage: true, business_rules: { passed: 5, total: 5 }, error_handling: true, performance: true }
        },
        {
          id: 6,
          job_name: 'm_SalesLookup_EnrichOrders',
          confidence_score: 72.1,
          confidence_level: 'MEDIUM',
          pattern_detected: 'Lookup',
          informatica_xml: `<?xml version="1.0" encoding="UTF-8"?>
<POWERMART REPOSITORY_VERSION="187.0">
  <REPOSITORY NAME="PROD_REPO">
    <FOLDER NAME="SalesETL">
      <MAPPING NAME="m_SalesLookup_EnrichOrders">
        <SOURCE NAME="SQ_ORDERS">
          <SOURCEFIELD NAME="ORDER_ID" DATATYPE="integer"/>
          <SOURCEFIELD NAME="PRODUCT_ID" DATATYPE="integer"/>
          <SOURCEFIELD NAME="QUANTITY" DATATYPE="integer"/>
        </SOURCE>
        <TRANSFORMATION NAME="LKP_PRODUCT_PRICING" TYPE="Lookup">
          <TRANSFORMFIELD NAME="PRODUCT_ID" PORTTYPE="INPUT/OUTPUT"/>
          <TRANSFORMFIELD NAME="UNIT_PRICE" PORTTYPE="OUTPUT"/>
          <TRANSFORMFIELD NAME="DISCOUNT_ELIGIBLE" PORTTYPE="OUTPUT"/>
          <TABLEATTRIBUTE NAME="Lookup table" VALUE="PRODUCT_MASTER"/>
          <TABLEATTRIBUTE NAME="Lookup condition" VALUE="PRODUCT_ID = PRODUCT_ID"/>
        </TRANSFORMATION>
        <TRANSFORMATION NAME="EXP_CALCULATE_TOTAL" TYPE="Expression">
          <TRANSFORMFIELD NAME="LINE_TOTAL" EXPRESSION="QUANTITY * UNIT_PRICE"/>
        </TRANSFORMATION>
        <TARGET NAME="TGT_ORDER_DETAILS"/>
      </MAPPING>
    </FOLDER>
  </REPOSITORY>
</POWERMART>`,
          talend_xml: `<?xml version="1.0" encoding="UTF-8"?>
<talendfile:ProcessType xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:talendfile="platform:/resource/org.talend.model/model/TalendFile.xsd" xmlns:TalendMapper="http://www.talend.org/mapper" defaultContext="Default" jobType="Standard">
  <parameters>
    <elementParameter field="TEXT" name="SCREEN_OFFSET_X" value="0"/>
    <elementParameter field="TEXT" name="SCREEN_OFFSET_Y" value="0"/>
  </parameters>
  <node componentName="tOracleInput" componentVersion="0.102.0" posX="96" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tOracleInput_Orders"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;ORDERS&quot;"/>
    <elementParameter field="MEMO_SQL" name="QUERY" value="&quot;SELECT ORDER_ID, PRODUCT_ID, QUANTITY FROM ORDERS&quot;"/>
    <elementParameter field="TEXT" name="LABEL" value="Source: Orders (Main)"/>
    <metadata connector="FLOW" name="orders">
      <column comment="" key="false" length="10" name="ORDER_ID" nullable="false" pattern="" precision="0" sourceType="NUMBER" type="id_Integer" usefulColumn="true"/>
      <column comment="" key="false" length="10" name="PRODUCT_ID" nullable="false" pattern="" precision="0" sourceType="NUMBER" type="id_Integer" usefulColumn="true"/>
      <column comment="" key="false" length="10" name="QUANTITY" nullable="true" pattern="" precision="0" sourceType="NUMBER" type="id_Integer" usefulColumn="true"/>
    </metadata>
  </node>
  <node componentName="tOracleInput" componentVersion="0.102.0" posX="96" posY="256">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tOracleInput_ProductMaster"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;PRODUCT_MASTER&quot;"/>
    <elementParameter field="MEMO_SQL" name="QUERY" value="&quot;SELECT PRODUCT_ID, UNIT_PRICE, DISCOUNT_ELIGIBLE FROM PRODUCT_MASTER&quot;"/>
    <elementParameter field="TEXT" name="LABEL" value="Lookup: Product Pricing"/>
    <metadata connector="FLOW" name="product_master">
      <column comment="" key="false" length="10" name="PRODUCT_ID" nullable="false" pattern="" precision="0" sourceType="NUMBER" type="id_Integer" usefulColumn="true"/>
      <column comment="" key="false" length="10" name="UNIT_PRICE" nullable="true" pattern="" precision="10" scale="2" sourceType="NUMBER" type="id_BigDecimal" usefulColumn="true"/>
      <column comment="" key="false" length="1" name="DISCOUNT_ELIGIBLE" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
    </metadata>
  </node>
  <node componentName="tMap" componentVersion="2.1" posX="320" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tMap_EnrichOrders"/>
    <elementParameter field="EXTERNAL" name="MAP" value=""/>
    <elementParameter field="CHECK" name="DIE_ON_ERROR" value="false"/>
    <elementParameter field="CHECK" name="LKUP_PARALLELIZE" value="false"/>
    <elementParameter field="TEXT" name="LOOKUP_MODEL_LOAD_ONCE" value="LOAD_ONCE"/>
    <elementParameter field="TEXT" name="LABEL" value="Lookup Product Pricing and Calculate Totals"/>
    <metadata connector="FLOW" name="enriched_orders">
      <column name="ORDER_ID" type="id_Integer" length="10"/>
      <column name="PRODUCT_ID" type="id_Integer" length="10"/>
      <column name="QUANTITY" type="id_Integer" length="10"/>
      <column name="UNIT_PRICE" type="id_BigDecimal" precision="10" scale="2"/>
      <column name="DISCOUNT_ELIGIBLE" type="id_String" length="1"/>
      <column name="LINE_TOTAL" type="id_BigDecimal" precision="15" scale="2"/>
    </metadata>
    <nodeData xsi:type="TalendMapper:MapperData">
      <inputTables lookupMode="LOAD_ONCE" matchingMode="UNIQUE_MATCH" name="lkp_product_pricing">
        <mapperTableEntries name="PRODUCT_ID" expression="" type="id_Integer"/>
        <mapperTableEntries name="UNIT_PRICE" expression="" type="id_BigDecimal"/>
        <mapperTableEntries name="DISCOUNT_ELIGIBLE" expression="" type="id_String"/>
      </inputTables>
      <outputTables name="enriched_orders">
        <mapperTableEntries expression="row1.ORDER_ID" name="ORDER_ID" type="id_Integer"/>
        <mapperTableEntries expression="row1.PRODUCT_ID" name="PRODUCT_ID" type="id_Integer"/>
        <mapperTableEntries expression="row1.QUANTITY" name="QUANTITY" type="id_Integer"/>
        <mapperTableEntries expression="lkp_product_pricing.UNIT_PRICE" name="UNIT_PRICE" type="id_BigDecimal"/>
        <mapperTableEntries expression="lkp_product_pricing.DISCOUNT_ELIGIBLE" name="DISCOUNT_ELIGIBLE" type="id_String"/>
        <mapperTableEntries expression="row1.QUANTITY * lkp_product_pricing.UNIT_PRICE" name="LINE_TOTAL" type="id_BigDecimal"/>
      </outputTables>
    </nodeData>
  </node>
  <node componentName="tOracleOutput" componentVersion="0.102.0" posX="544" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tOracleOutput_OrderDetails"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;ORDER_DETAILS&quot;"/>
    <elementParameter field="CLOSED_LIST" name="DATA_ACTION" value="INSERT"/>
    <elementParameter field="TEXT" name="COMMIT_EVERY" value="10000"/>
    <elementParameter field="TEXT" name="LABEL" value="Target: Order Details with Pricing"/>
    <metadata connector="FLOW" name="tOracleOutput_OrderDetails"/>
  </node>
  <connection connectorName="FLOW" label="row1" lineStyle="0" metaname="orders" source="tOracleInput_Orders" target="tMap_EnrichOrders"/>
  <connection connectorName="FLOW" label="lkp_product_pricing" lineStyle="0" metaname="product_master" source="tOracleInput_ProductMaster" target="tMap_EnrichOrders">
    <elementParameter field="TABLE" name="LOOKUP" value="PRODUCT_ID"/>
  </connection>
  <connection connectorName="FLOW" label="enriched_orders" lineStyle="0" metaname="enriched_orders" source="tMap_EnrichOrders" target="tOracleOutput_OrderDetails"/>
</talendfile:ProcessType>`,
          transformations: {
            'LKP_PRODUCT_PRICING': 'tMap lookup',
            'EXP_CALCULATE_TOTAL': 'tMap calculation'
          },
          warnings: ['Unmatched lookups will result in null prices', 'Consider connected lookup for error handling', 'Cache size configuration needed for performance'],
          created_at: '2024-11-28T10:30:00.000Z',
          validation: { data_lineage: true, business_rules: { passed: 5, total: 5 }, error_handling: true, performance: true }
        },
        {
          id: 7,
          job_name: 'm_DataQuality_AddressValidation',
          confidence_score: 65.8,
          confidence_level: 'MEDIUM',
          pattern_detected: 'Expression Transformation',
          informatica_xml: `<?xml version="1.0" encoding="UTF-8"?>
<POWERMART REPOSITORY_VERSION="187.0">
  <REPOSITORY NAME="PROD_REPO">
    <FOLDER NAME="DataQualityETL">
      <MAPPING NAME="m_DataQuality_AddressValidation">
        <SOURCE NAME="SQ_RAW_ADDRESSES">
          <SOURCEFIELD NAME="ADDRESS_ID" DATATYPE="integer"/>
          <SOURCEFIELD NAME="STREET" DATATYPE="varchar" PRECISION="200"/>
          <SOURCEFIELD NAME="CITY" DATATYPE="varchar" PRECISION="100"/>
          <SOURCEFIELD NAME="STATE" DATATYPE="varchar" PRECISION="2"/>
          <SOURCEFIELD NAME="ZIP" DATATYPE="varchar" PRECISION="10"/>
        </SOURCE>
        <TRANSFORMATION NAME="EXP_VALIDATE_ADDRESS" TYPE="Expression">
          <TRANSFORMFIELD NAME="STREET_CLEAN" EXPRESSION="TRIM(UPPER(STREET))"/>
          <TRANSFORMFIELD NAME="CITY_CLEAN" EXPRESSION="TRIM(INITCAP(CITY))"/>
          <TRANSFORMFIELD NAME="STATE_UPPER" EXPRESSION="UPPER(TRIM(STATE))"/>
          <TRANSFORMFIELD NAME="ZIP_FORMATTED" EXPRESSION="SUBSTR(REPLACECHR(0, ZIP, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', ''), 1, 5)"/>
          <TRANSFORMFIELD NAME="IS_VALID_STATE" EXPRESSION="IIF(LENGTH(STATE) = 2 AND STATE IN ('AL','AK','AZ','CA','NY','TX'), 1, 0)"/>
          <TRANSFORMFIELD NAME="IS_VALID_ZIP" EXPRESSION="IIF(LENGTH(ZIP_FORMATTED) = 5 AND IS_NUMBER(ZIP_FORMATTED), 1, 0)"/>
          <TRANSFORMFIELD NAME="QUALITY_SCORE" EXPRESSION="IS_VALID_STATE + IS_VALID_ZIP"/>
        </TRANSFORMATION>
        <TRANSFORMATION NAME="FIL_QUALITY_CHECK" TYPE="Filter">
          <TRANSFORMFIELD NAME="FILTER_CONDITION" EXPRESSION="QUALITY_SCORE >= 1"/>
        </TRANSFORMATION>
        <TARGET NAME="TGT_VALIDATED_ADDRESSES"/>
      </MAPPING>
    </FOLDER>
  </REPOSITORY>
</POWERMART>`,
          talend_xml: `<?xml version="1.0" encoding="UTF-8"?>
<talendfile:ProcessType xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:talendfile="platform:/resource/org.talend.model/model/TalendFile.xsd" xmlns:TalendMapper="http://www.talend.org/mapper" defaultContext="Default" jobType="Standard">
  <parameters>
    <elementParameter field="TEXT" name="SCREEN_OFFSET_X" value="0"/>
    <elementParameter field="TEXT" name="SCREEN_OFFSET_Y" value="0"/>
  </parameters>
  <node componentName="tOracleInput" componentVersion="0.102.0" posX="96" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tOracleInput_RawAddresses"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;RAW_ADDRESSES&quot;"/>
    <elementParameter field="MEMO_SQL" name="QUERY" value="&quot;SELECT ADDRESS_ID, STREET, CITY, STATE, ZIP FROM RAW_ADDRESSES&quot;"/>
    <elementParameter field="TEXT" name="LABEL" value="Source: Raw Addresses (Uncleaned)"/>
    <metadata connector="FLOW" name="raw_addresses">
      <column comment="" key="false" length="10" name="ADDRESS_ID" nullable="false" pattern="" precision="0" sourceType="NUMBER" type="id_Integer" usefulColumn="true"/>
      <column comment="" key="false" length="200" name="STREET" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="100" name="CITY" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="2" name="STATE" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
      <column comment="" key="false" length="10" name="ZIP" nullable="true" pattern="" precision="0" sourceType="VARCHAR2" type="id_String" usefulColumn="true"/>
    </metadata>
  </node>
  <node componentName="tMap" componentVersion="2.1" posX="320" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tMap_ValidateAddress"/>
    <elementParameter field="EXTERNAL" name="MAP" value=""/>
    <elementParameter field="CHECK" name="DIE_ON_ERROR" value="false"/>
    <elementParameter field="TEXT" name="LABEL" value="Data Quality: Address Validation &amp; Standardization"/>
    <metadata connector="FLOW" name="validated_addresses">
      <column name="ADDRESS_ID" type="id_Integer" length="10"/>
      <column name="STREET" type="id_String" length="200"/>
      <column name="CITY" type="id_String" length="100"/>
      <column name="STATE" type="id_String" length="2"/>
      <column name="ZIP" type="id_String" length="10"/>
      <column name="STREET_CLEAN" type="id_String" length="200"/>
      <column name="CITY_CLEAN" type="id_String" length="100"/>
      <column name="STATE_UPPER" type="id_String" length="2"/>
      <column name="ZIP_FORMATTED" type="id_String" length="5"/>
      <column name="IS_VALID_STATE" type="id_Integer"/>
      <column name="IS_VALID_ZIP" type="id_Integer"/>
      <column name="QUALITY_SCORE" type="id_Integer"/>
    </metadata>
    <nodeData xsi:type="TalendMapper:MapperData">
      <varTables sizeState="INTERMEDIATE" name="Var">
        <mapperTableEntries name="ZIP_FORMATTED" expression="row1.ZIP.replaceAll(&quot;[A-Za-z]&quot;, &quot;&quot;).substring(0, Math.min(5, row1.ZIP.length()))" type="id_String"/>
        <mapperTableEntries name="IS_VALID_STATE" expression="(row1.STATE != null &amp;&amp; row1.STATE.length() == 2 &amp;&amp; java.util.Arrays.asList(&quot;AL&quot;,&quot;AK&quot;,&quot;AZ&quot;,&quot;CA&quot;,&quot;NY&quot;,&quot;TX&quot;).contains(row1.STATE.toUpperCase())) ? 1 : 0" type="id_Integer"/>
        <mapperTableEntries name="IS_VALID_ZIP" expression="(Var.ZIP_FORMATTED.length() == 5 &amp;&amp; Var.ZIP_FORMATTED.matches(&quot;\\d{5}&quot;)) ? 1 : 0" type="id_Integer"/>
      </varTables>
      <outputTables name="validated_addresses">
        <mapperTableEntries expression="row1.ADDRESS_ID" name="ADDRESS_ID" type="id_Integer"/>
        <mapperTableEntries expression="row1.STREET" name="STREET" type="id_String"/>
        <mapperTableEntries expression="row1.CITY" name="CITY" type="id_String"/>
        <mapperTableEntries expression="row1.STATE" name="STATE" type="id_String"/>
        <mapperTableEntries expression="row1.ZIP" name="ZIP" type="id_String"/>
        <mapperTableEntries expression="StringHandling.TRIM(StringHandling.UPCASE(row1.STREET))" name="STREET_CLEAN" type="id_String"/>
        <mapperTableEntries expression="StringHandling.TRIM(TalendString.initCap(row1.CITY))" name="CITY_CLEAN" type="id_String"/>
        <mapperTableEntries expression="StringHandling.UPCASE(StringHandling.TRIM(row1.STATE))" name="STATE_UPPER" type="id_String"/>
        <mapperTableEntries expression="Var.ZIP_FORMATTED" name="ZIP_FORMATTED" type="id_String"/>
        <mapperTableEntries expression="Var.IS_VALID_STATE" name="IS_VALID_STATE" type="id_Integer"/>
        <mapperTableEntries expression="Var.IS_VALID_ZIP" name="IS_VALID_ZIP" type="id_Integer"/>
        <mapperTableEntries expression="Var.IS_VALID_STATE + Var.IS_VALID_ZIP" name="QUALITY_SCORE" type="id_Integer"/>
      </outputTables>
    </nodeData>
  </node>
  <node componentName="tFilterRow" componentVersion="1.1" posX="544" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tFilterRow_QualityCheck"/>
    <elementParameter field="TABLE" name="CONDITIONS">
      <elementValue elementRef="INPUT_COLUMN" value="QUALITY_SCORE"/>
      <elementValue elementRef="FUNCTION" value="&gt;="/>
      <elementValue elementRef="VALUE" value="1"/>
    </elementParameter>
    <elementParameter field="TEXT" name="LABEL" value="Filter: Minimum Quality Score = 1"/>
    <metadata connector="FLOW" name="quality_passed"/>
  </node>
  <node componentName="tOracleOutput" componentVersion="0.102.0" posX="768" posY="128">
    <elementParameter field="TEXT" name="UNIQUE_NAME" value="tOracleOutput_ValidatedAddresses"/>
    <elementParameter field="TEXT" name="TABLE" value="&quot;VALIDATED_ADDRESSES&quot;"/>
    <elementParameter field="CLOSED_LIST" name="DATA_ACTION" value="INSERT"/>
    <elementParameter field="TEXT" name="COMMIT_EVERY" value="10000"/>
    <elementParameter field="TEXT" name="LABEL" value="Target: Validated &amp; Standardized Addresses"/>
    <metadata connector="FLOW" name="tOracleOutput_ValidatedAddresses"/>
  </node>
  <connection connectorName="FLOW" label="row1" lineStyle="0" metaname="raw_addresses" source="tOracleInput_RawAddresses" target="tMap_ValidateAddress"/>
  <connection connectorName="FLOW" label="validated_addresses" lineStyle="0" metaname="validated_addresses" source="tMap_ValidateAddress" target="tFilterRow_QualityCheck"/>
  <connection connectorName="FLOW" label="quality_passed" lineStyle="0" metaname="quality_passed" source="tFilterRow_QualityCheck" target="tOracleOutput_ValidatedAddresses"/>
</talendfile:ProcessType>`,
          transformations: {
            'EXP_VALIDATE_ADDRESS': 'tMap data quality rules',
            'FIL_QUALITY_CHECK': 'tFilterRow quality filter'
          },
          warnings: ['State validation list is incomplete - only 6 states', 'No handling for rejected addresses', 'ZIP+4 format not supported', 'International addresses will fail validation'],
          created_at: '2024-11-28T10:30:00.000Z',
          validation: { data_lineage: true, business_rules: { passed: 5, total: 5 }, error_handling: true, performance: true }
        }
      ]

      const mockStats: PreviewStats = {
        total_jobs: 7,
        jobs_with_preview: 7,
        avg_confidence: 84.4,
        high_confidence_count: 3,
        needs_review_count: 2,
        very_high_count: 3,
        high_count: 2,
        medium_count: 2,
        low_count: 0
      }

      setJobs(mockJobs)
      setStats(mockStats)
      setSelectedJob(mockJobs[0])
      setUsingMockData(true)
      setLoading(false)
    }

    fetchPreview()
    const interval = setInterval(fetchPreview, 30000) // Poll every 30s

    return () => clearInterval(interval)
  }, [migrationId])

  // Filter and search jobs
  const filteredJobs = jobs.filter(job => {
    // Search filter
    if (searchQuery && !job.job_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Confidence filter
    if (activeFilter === 'all') return true
    if (activeFilter === 'needs_review') {
      return job.confidence_level === 'MEDIUM' || job.confidence_level === 'LOW'
    }
    return job.confidence_level === activeFilter.toUpperCase()
  })

  // Export functionality
  const downloadJob = async (job: PreviewJob) => {
    try {
      const zip = new JSZip()

      // Add Informatica XML
      zip.file(`${job.job_name}_Informatica.xml`, job.informatica_xml)

      // Add Talend XML
      zip.file(`${job.job_name}_Talend.item`, job.talend_xml)

      // Add metadata file
      const metadata = {
        job_name: job.job_name,
        pattern: job.pattern_detected,
        confidence_score: job.confidence_score,
        confidence_level: job.confidence_level,
        warnings: job.warnings,
        export_date: new Date().toISOString()
      }
      zip.file(`${job.job_name}_metadata.json`, JSON.stringify(metadata, null, 2))

      // Generate ZIP
      const blob = await zip.generateAsync({ type: 'blob' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${job.job_name}_conversion.zip`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export job. Please try again.')
    }
  }

  const downloadAllJobs = async () => {
    try {
      const zip = new JSZip()

      // Add all jobs
      jobs.forEach((job) => {
        const jobFolder = zip.folder(job.job_name)
        if (jobFolder) {
          jobFolder.file(`${job.job_name}_Informatica.xml`, job.informatica_xml)
          jobFolder.file(`${job.job_name}_Talend.item`, job.talend_xml)

          const metadata = {
            job_name: job.job_name,
            pattern: job.pattern_detected,
            confidence_score: job.confidence_score,
            confidence_level: job.confidence_level,
            warnings: job.warnings
          }
          jobFolder.file('metadata.json', JSON.stringify(metadata, null, 2))
        }
      })

      // Add summary report
      const summary = {
        migration_id: migrationId,
        export_date: new Date().toISOString(),
        total_jobs: stats?.total_jobs || 0,
        avg_confidence: stats?.avg_confidence || 0,
        high_confidence_count: stats?.high_confidence_count || 0,
        needs_review_count: stats?.needs_review_count || 0,
        jobs: jobs.map(j => ({
          name: j.job_name,
          confidence: j.confidence_score,
          pattern: j.pattern_detected,
          warnings_count: j.warnings.length
        }))
      }
      zip.file('migration_summary.json', JSON.stringify(summary, null, 2))

      // Generate ZIP
      const blob = await zip.generateAsync({ type: 'blob' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `migration_${migrationId}_all_jobs.zip`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export all failed:', error)
      alert('Failed to export all jobs. Please try again.')
    }
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Shared Header with Session Management */}
      <Header />

      {/* Compact Preview Header with Inline Stats */}
      <div className="bg-white border-b border-gray-200 px-8 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Migration Preview <span className="text-gray-400">•</span> <span className="text-gray-600">CustomerETL v2</span>
            </h1>
            <p className="text-xs text-gray-600">Side-by-side XML comparison</p>
          </div>

          {/* Inline Stats */}
          {stats && <PreviewSummary stats={stats} />}

        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Job List (25% or collapsed) */}
        <div className={`${isJobListCollapsed ? 'w-12' : 'w-[25%]'} border-r border-gray-200 bg-white flex flex-col transition-all duration-300 relative`}>
          {/* Collapse Button */}
          <button
            onClick={() => setIsJobListCollapsed(!isJobListCollapsed)}
            className="absolute top-4 -right-3 z-50 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 shadow-md"
            title={isJobListCollapsed ? 'Expand job list' : 'Collapse job list'}
          >
            {isJobListCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {!isJobListCollapsed && (
            <>
              {/* Search and Filter */}
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                      activeFilter === 'all'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All ({stats?.total_jobs || 0})
                  </button>
                  <button
                    onClick={() => setActiveFilter('very_high')}
                    className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                      activeFilter === 'very_high'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Very High ({stats?.very_high_count || 0})
                  </button>
                  <button
                    onClick={() => setActiveFilter('high')}
                    className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                      activeFilter === 'high'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    High ({stats?.high_count || 0})
                  </button>
                  <button
                    onClick={() => setActiveFilter('needs_review')}
                    className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                      activeFilter === 'needs_review'
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Review ({stats?.needs_review_count || 0})
                  </button>
                </div>
              </div>

              {/* Job List */}
              <ErrorBoundary>
                <JobList
                  jobs={filteredJobs}
                  selectedJob={selectedJob}
                  onSelectJob={setSelectedJob}
                  loading={loading}
                />
              </ErrorBoundary>
            </>
          )}
        </div>

        {/* Right Side - Preview Content (75% or expanded) */}
        <div className={`${isJobListCollapsed ? 'w-[calc(100%-48px)]' : 'w-[75%]'} bg-gray-50 transition-all duration-300 overflow-hidden`}>
          {selectedJob ? (
            <ErrorBoundary>
              <PreviewContent job={selectedJob} />
            </ErrorBoundary>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center px-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-blue-500" />
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-2">No job selected</div>
                <div className="text-sm text-gray-600 mb-4">
                  Select a job from the list on the left to view its XML conversion preview
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
                  <ArrowLeftCircle className="w-4 h-4" />
                  <span>Click any job in the list to get started</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
